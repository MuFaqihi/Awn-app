from flask import Blueprint, request, jsonify
from . import db
from .models import Appointment

appt_bp = Blueprint('appointments', __name__)

@appt_bp.route('', methods=['POST'])
def create_appointment():
    data = request.json
    doctor_id = data.get('doctor_id')
    patient_id = data.get('patient_id')
    start_time = data.get('start_time')
    end_time = data.get('end_time')
    appt = Appointment(doctor_id=doctor_id, patient_id=patient_id, start_time=start_time, end_time=end_time)
    db.session.add(appt)
    db.session.commit()
    return jsonify({'id': appt.id}), 201

@appt_bp.route('', methods=['GET'])
def list_appointments():
    appts = Appointment.query.limit(50).all()
    return jsonify([{'id':a.id,'doctor_id':a.doctor_id,'patient_id':a.patient_id} for a in appts])
