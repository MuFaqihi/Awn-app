awn-backend/
├── 📁 src/
│   ├── 📁 controllers/          
│   │   ├── auth/                    # 📁 NEW - مجلد مصادقة منفصل
│   │   │   ├── patient-auth.controller.ts
│   │   │   ├── specialist-auth.controller.ts
│   │   │   └── auth.controller.ts   (للخدمات العامة)
│   │   ├── patients.controller.ts   (لعمليات المريض بعد المصادقة)
│   │   ├── bookings.controller.ts
│   │   ├── therapists.controller.ts
│   │   └── specialists.controller.ts (لعمليات الأخصائي بعد المصادقة)
│   │
│   ├── 📁 routes/              
│   │   ├── auth/                    # 📁 NEW - مجلد مسارات مصادقة
│   │   │   ├── patient-auth.routes.ts
│   │   │   ├── specialist-auth.routes.ts
│   │   │   └── index.ts             (يجمع كل مسارات المصادقة)
│   │   ├── patients.routes.ts
│   │   ├── bookings.routes.ts
│   │   ├── therapists.routes.ts
│   │   ├── specialists.routes.ts
│   │   └── index.ts
│   │
│   ├── 📁 middleware/          
│   │   ├── auth/                    # 📁 NEW - مجلد وسائط مصادقة
│   │   │   ├── auth.middleware.ts   (عام)
│   │   │   ├── patient-auth.middleware.ts
│   │   │   └── specialist-auth.middleware.ts
│   │   ├── validation.middleware.ts
│   │   └── error.middleware.ts
│   │
│   ├── 📁 services/            
│   │   ├── auth/                    # 📁 NEW - مجلد خدمات مصادقة
│   │   │   ├── patient-auth.service.ts
│   │   │   ├── specialist-auth.service.ts
│   │   │   └── auth.service.ts      (خدمات مشتركة)
│   │   ├── patients.service.ts
│   │   ├── bookings.service.ts
│   │   ├── therapists.service.ts
│   │   └── supabase.service.ts
│   │
│   ├── 📁 utils/               
│   │   ├── jwt.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── email.ts                 # 📁 NEW - لإرسال البريد
│   │
│   ├── 📁 types/               
│   │   ├── auth/                    # 📁 NEW - مجلد أنواع المصادقة
│   │   │   ├── patient-auth.types.ts
│   │   │   ├── specialist-auth.types.ts
│   │   │   └── auth.types.ts
│   │   ├── patient.types.ts
│   │   ├── booking.types.ts
│   │   └── specialist.types.ts      # 📁 NEW - لأنواع الأخصائي
│   │
│   └── app.ts                  
├── 📁 config/                  
│   └── database.ts
├── package.json
├── package-lock.json
├── .env
├── .gitignore
└── README.md

