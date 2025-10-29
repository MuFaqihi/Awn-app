"use client";
import * as React from "react";
import type { Locale } from "@/lib/i18n";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getAllTherapists } from "@/lib/therapists";
import { LikeButton } from "@/components/ui/like-button";
import { GradientSlideButton } from "@/components/ui/gradient-slide-button";
import { Expandable, ExpandableContent } from "@/components/ui/expandable";
import { Heart, MapPin, Star, Calendar } from "lucide-react";

interface FavoritesClientProps {
  locale: Locale;
}

export default function FavoritesClient({ locale }: FavoritesClientProps) {
  const ar = locale === "ar";
  
  // State to manage favorites
  const [favorites, setFavorites] = React.useState<string[]>(["t_dr_mona", "t_dr_basel"]); // Mock some favorites
  const allTherapists = getAllTherapists();
  const favoriteTherapists = allTherapists.filter(t => favorites.includes(t.id));

  const toggleFavorite = (therapistId: string) => {
    setFavorites(prev => 
      prev.includes(therapistId) 
        ? prev.filter(id => id !== therapistId)
        : [...prev, therapistId]
    );
  };

  const handleBookAppointment = (therapistId: string) => {
    window.location.href = `/${locale}/therapists/${therapistId}`;
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{ar ? "المفضلة" : "Favorites"}</h1>
        <p className="text-muted-foreground mt-2 text-lg">
          {ar ? "المعالجون المفضلون لديك" : "Your favorite therapists"}
        </p>
      </div>

      {favoriteTherapists.length === 0 ? (
        <Card className="text-center py-16">
          <Heart className="mx-auto h-20 w-20 text-gray-300 mb-6" />
          <h3 className="text-xl font-medium text-gray-900 mb-3">
            {ar ? "لا توجد مفضلة بعد" : "No favorites yet"}
          </h3>
          <p className="text-gray-500 mb-8 text-lg">
            {ar ? "ابدأ بإضافة المعالجين المفضلين لديك" : "Start adding your favorite therapists"}
          </p>
          <GradientSlideButton onClick={() => window.location.href = `/${locale}/therapists`}>
            {ar ? "تصفح المعالجين" : "Browse Therapists"}
          </GradientSlideButton>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {favoriteTherapists.map((therapist) => (
            <Expandable key={therapist.id}>
              <Card className="overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <img 
                      src={therapist.avatar || "/avatar-placeholder.jpg"} 
                      className="h-16 w-16 rounded-full object-cover flex-shrink-0" 
                      alt={therapist.name} 
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-xl font-semibold truncate">
                            {ar ? therapist.nameAr : therapist.name}
                          </h3>
                          <p className="text-muted-foreground truncate">
                            {ar ? therapist.specialtyAr : therapist.specialty}
                          </p>
                        </div>
                        <LikeButton 
                          initialLiked={true}
                          onToggle={() => toggleFavorite(therapist.id)} 
                        />
                      </div>
                      
                      <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-amber-500" fill="currentColor" />
                          {therapist.rating}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {therapist.experience} {ar ? "سنوات خبرة" : "years exp"}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {ar ? therapist.locationAr : therapist.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button 
                      onClick={() => handleBookAppointment(therapist.id)}
                      className="flex-1"
                    >
                      {ar ? "احجز موعد" : "Book Appointment"}
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => window.location.href = `/${locale}/therapists/${therapist.id}`}
                    >
                      {ar ? "عرض الملف" : "View Profile"}
                    </Button>
                  </div>
                </div>

                {/* Expandable Details */}
                <ExpandableContent preset="slide-down">
                  <div className="border-t p-6 bg-muted/20">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-semibold mb-2">{ar ? "نبذة مختصرة:" : "Bio:"}</h4>
                        <p className="text-sm text-muted-foreground">
                          {ar ? therapist.bioAr : therapist.bio}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-muted-foreground">{ar ? "السعر:" : "Price:"}</span>
                          <p>{therapist.price} {therapist.currency}</p>
                        </div>
                        <div>
                          <span className="font-medium text-muted-foreground">{ar ? "اللغات:" : "Languages:"}</span>
                          <p>{therapist.languages.join(", ")}</p>
                        </div>
                      </div>

                      <div>
                        <span className="font-medium text-muted-foreground">{ar ? "الخدمات المتاحة:" : "Available Services:"}</span>
                        <div className="flex gap-2 mt-1">
                          {therapist.isOnline && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                              {ar ? "أونلاين" : "Online"}
                            </span>
                          )}
                          {therapist.isClinic && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                              {ar ? "في العيادة" : "In Clinic"}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="pt-4">
                        <GradientSlideButton 
                          onClick={() => handleBookAppointment(therapist.id)}
                          className="w-full"
                        >
                          {ar ? "احجز موعد سريع" : "Quick Book"}
                        </GradientSlideButton>
                      </div>
                    </div>
                  </div>
                </ExpandableContent>
              </Card>
            </Expandable>
          ))}
        </div>
      )}
    </div>
  );
}