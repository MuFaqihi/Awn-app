const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const Joi = require('joi');

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Validation schemas
const medicalHistorySchema = Joi.object({
  snapshot: Joi.object({
    bloodType: Joi.string().valid('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'),
    height: Joi.number().min(0).max(300),
    weight: Joi.number().min(0).max(500),
    dateOfBirth: Joi.date().max('now'),
    gender: Joi.string().valid('male', 'female', 'other'),
    emergencyContact: Joi.object({
      name: Joi.string().max(100),
      phone: Joi.string().max(20),
      relationship: Joi.string().max(50)
    })
  }).optional(),

  conditions: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required().max(100),
      diagnosisDate: Joi.date().max('now'),
      status: Joi.string().valid('active', 'resolved', 'chronic'),
      notes: Joi.string().max(500).allow('')
    })
  ).optional(),

  medications: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required().max(100),
      dosage: Joi.string().max(50),
      frequency: Joi.string().max(50),
      startDate: Joi.date().max('now'),
      endDate: Joi.date().min(Joi.ref('startDate')).allow(null),
      anticoagulant: Joi.boolean().default(false),
      notes: Joi.string().max(500).allow('')
    })
  ).optional(),

  allergies: Joi.array().items(
    Joi.object({
      id: Joi.string().optional(),
      name: Joi.string().required().max(100),
      severity: Joi.string().valid('mild', 'moderate', 'severe'),
      reaction: Joi.string().max(200),
      notes: Joi.string().max(500).allow('')
    })
  ).optional(),

  vitals: Joi.object({
    bloodPressure: Joi.object({
      systolic: Joi.number().min(0).max(300),
      diastolic: Joi.number().min(0).max(200),
      lastRecorded: Joi.date().max('now')
    }).optional(),
    heartRate: Joi.number().min(0).max(300).optional(),
    temperature: Joi.number().min(30).max(45).optional(),
    lastUpdated: Joi.date().max('now').optional()
  }).optional(),

  consent: Joi.object({
    consentToTreatment: Joi.boolean().default(false),
    consentDate: Joi.date().max('now'),
    witnessName: Joi.string().max(100).allow(''),
    emergencyContactInformed: Joi.boolean().default(false)
  }).optional(),

  contraindications: Joi.object({
    absolute: Joi.array().items(Joi.string().max(200)).optional(),
    relative: Joi.array().items(Joi.string().max(200)).optional()
  }).optional(),

  isSetupComplete: Joi.boolean().default(false),
  lastUpdated: Joi.date().default(Date.now)
});

// GET medical history for authenticated user
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_histories')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No medical history found, return empty structure
        return res.json({
          snapshot: {},
          conditions: [],
          medications: [],
          allergies: [],
          vitals: {},
          consent: {},
          contraindications: {},
          isSetupComplete: false,
          lastUpdated: null
        });
      }
      throw error;
    }

    res.json(data.history_data || {});
  } catch (error) {
    console.error('Get medical history error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medical history',
      message: error.message 
    });
  }
});

// CREATE or UPDATE medical history
router.put('/', async (req, res) => {
  try {
    // Validate request body
    const { error: validationError, value } = medicalHistorySchema.validate(req.body);
    if (validationError) {
      return res.status(400).json({
        error: 'Validation failed',
        details: validationError.details
      });
    }

    const historyData = {
      ...value,
      lastUpdated: new Date().toISOString()
    };

    // Check if record exists
    const { data: existingRecord } = await supabase
      .from('medical_histories')
      .select('id')
      .eq('user_id', req.user.id)
      .single();

    let result;
    if (existingRecord) {
      // Update existing record
      result = await supabase
        .from('medical_histories')
        .update({ 
          history_data: historyData,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', req.user.id);
    } else {
      // Create new record
      result = await supabase
        .from('medical_histories')
        .insert({
          user_id: req.user.id,
          history_data: historyData,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
    }

    if (result.error) throw result.error;

    res.json({
      success: true,
      message: 'Medical history saved successfully',
      data: historyData
    });
  } catch (error) {
    console.error('Save medical history error:', error);
    res.status(500).json({ 
      error: 'Failed to save medical history',
      message: error.message 
    });
  }
});

// GET medical history warnings/alerts
router.get('/warnings', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('medical_histories')
      .select('history_data')
      .eq('user_id', req.user.id)
      .single();

    if (error) throw error;

    const history = data?.history_data || {};
    const warnings = [];

    // Check for anticoagulant medications
    if (history.medications) {
      const anticoagulants = history.medications.filter(med => med.anticoagulant);
      if (anticoagulants.length > 0) {
        warnings.push({
          type: 'medication',
          message: `Patient on anticoagulants: ${anticoagulants.map(m => m.name).join(', ')}`,
          severity: 'high'
        });
      }
    }

    // Check for absolute contraindications
    if (history.contraindications?.absolute?.length > 0) {
      warnings.push({
        type: 'contraindication',
        message: `Absolute contraindications: ${history.contraindications.absolute.join(', ')}`,
        severity: 'critical'
      });
    }

    // Check for severe allergies
    if (history.allergies) {
      const severeAllergies = history.allergies.filter(allergy => allergy.severity === 'severe');
      if (severeAllergies.length > 0) {
        warnings.push({
          type: 'allergy',
          message: `Severe allergies: ${severeAllergies.map(a => a.name).join(', ')}`,
          severity: 'high'
        });
      }
    }

    res.json({ warnings });
  } catch (error) {
    console.error('Get warnings error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch medical warnings',
      message: error.message 
    });
  }
});

// DELETE medical history
router.delete('/', async (req, res) => {
  try {
    const { error } = await supabase
      .from('medical_histories')
      .delete()
      .eq('user_id', req.user.id);

    if (error) throw error;

    res.json({
      success: true,
      message: 'Medical history deleted successfully'
    });
  } catch (error) {
    console.error('Delete medical history error:', error);
    res.status(500).json({ 
      error: 'Failed to delete medical history',
      message: error.message 
    });
  }
});

module.exports = router;
