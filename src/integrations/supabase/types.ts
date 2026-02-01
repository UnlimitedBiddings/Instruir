export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      availability: {
        Row: {
          created_at: string
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean
          professional_id: string
          start_time: string
        }
        Insert: {
          created_at?: string
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean
          professional_id: string
          start_time: string
        }
        Update: {
          created_at?: string
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean
          professional_id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "availability_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          latitude: number | null
          logo_url: string | null
          longitude: number | null
          name: string
          owner_id: string | null
          phone: string | null
          rating: number | null
          review_count: number | null
          type: Database["public"]["Enums"]["professional_category"]
          updated_at: string
          verified: boolean | null
        }
        Insert: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          type: Database["public"]["Enums"]["professional_category"]
          updated_at?: string
          verified?: boolean | null
        }
        Update: {
          address?: string | null
          city?: string | null
          cnpj?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          logo_url?: string | null
          longitude?: number | null
          name?: string
          owner_id?: string | null
          phone?: string | null
          rating?: number | null
          review_count?: number | null
          type?: Database["public"]["Enums"]["professional_category"]
          updated_at?: string
          verified?: boolean | null
        }
        Relationships: []
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message: string | null
          last_message_at: string | null
          participant_1: string
          participant_2: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant_1: string
          participant_2: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message?: string | null
          last_message_at?: string | null
          participant_1?: string
          participant_2?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          read: boolean
          sender_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          read?: boolean
          sender_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          data: Json | null
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          data?: Json | null
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          data?: Json | null
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      professionals: {
        Row: {
          address: string | null
          background_verified: boolean | null
          bio: string | null
          category: Database["public"]["Enums"]["professional_category"]
          city: string | null
          cnh_verified: boolean | null
          cnpj: string | null
          company_id: string | null
          created_at: string
          credentials_verified: boolean | null
          employment_type: string | null
          experience_years: number | null
          id: string
          identity_verified: boolean | null
          latitude: number | null
          longitude: number | null
          price_per_hour: number
          provider_type: Database["public"]["Enums"]["provider_type"] | null
          rating: number | null
          review_count: number | null
          service_zones: string[] | null
          skills: string[] | null
          specializations: string[] | null
          total_sessions: number | null
          updated_at: string
          user_id: string
          vehicle_color: string | null
          vehicle_has_ac: boolean | null
          vehicle_image_url: string | null
          vehicle_inspection_verified: boolean | null
          vehicle_model: string | null
          vehicle_transmission:
            | Database["public"]["Enums"]["transmission_type"]
            | null
          vehicle_year: number | null
        }
        Insert: {
          address?: string | null
          background_verified?: boolean | null
          bio?: string | null
          category: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          cnh_verified?: boolean | null
          cnpj?: string | null
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
          employment_type?: string | null
          experience_years?: number | null
          id?: string
          identity_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          price_per_hour: number
          provider_type?: Database["public"]["Enums"]["provider_type"] | null
          rating?: number | null
          review_count?: number | null
          service_zones?: string[] | null
          skills?: string[] | null
          specializations?: string[] | null
          total_sessions?: number | null
          updated_at?: string
          user_id: string
          vehicle_color?: string | null
          vehicle_has_ac?: boolean | null
          vehicle_image_url?: string | null
          vehicle_inspection_verified?: boolean | null
          vehicle_model?: string | null
          vehicle_transmission?:
            | Database["public"]["Enums"]["transmission_type"]
            | null
          vehicle_year?: number | null
        }
        Update: {
          address?: string | null
          background_verified?: boolean | null
          bio?: string | null
          category?: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          cnh_verified?: boolean | null
          cnpj?: string | null
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
          employment_type?: string | null
          experience_years?: number | null
          id?: string
          identity_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          price_per_hour?: number
          provider_type?: Database["public"]["Enums"]["provider_type"] | null
          rating?: number | null
          review_count?: number | null
          service_zones?: string[] | null
          skills?: string[] | null
          specializations?: string[] | null
          total_sessions?: number | null
          updated_at?: string
          user_id?: string
          vehicle_color?: string | null
          vehicle_has_ac?: boolean | null
          vehicle_image_url?: string | null
          vehicle_inspection_verified?: boolean | null
          vehicle_model?: string | null
          vehicle_transmission?:
            | Database["public"]["Enums"]["transmission_type"]
            | null
          vehicle_year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_professionals_company"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string
          id: string
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email: string
          id?: string
          name: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string
          id?: string
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          professional_id: string
          rating: number
          session_id: string
          student_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          professional_id: string
          rating: number
          session_id: string
          student_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          professional_id?: string
          rating?: number
          session_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      service_packages: {
        Row: {
          active: boolean | null
          company_id: string
          created_at: string
          description: string | null
          id: string
          includes: string[] | null
          name: string
          popular: boolean | null
          price_per_session: number
          price_total: number
          total_sessions: number
          updated_at: string
          validity_days: number
        }
        Insert: {
          active?: boolean | null
          company_id: string
          created_at?: string
          description?: string | null
          id?: string
          includes?: string[] | null
          name: string
          popular?: boolean | null
          price_per_session: number
          price_total: number
          total_sessions: number
          updated_at?: string
          validity_days?: number
        }
        Update: {
          active?: boolean | null
          company_id?: string
          created_at?: string
          description?: string | null
          id?: string
          includes?: string[] | null
          name?: string
          popular?: boolean | null
          price_per_session?: number
          price_total?: number
          total_sessions?: number
          updated_at?: string
          validity_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "service_packages_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      sessions: {
        Row: {
          address: string | null
          category: Database["public"]["Enums"]["professional_category"]
          city: string | null
          company_id: string | null
          created_at: string
          end_time: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          price: number
          professional_id: string
          rating: number | null
          review: string | null
          session_date: string
          start_time: string
          status: Database["public"]["Enums"]["session_status"]
          student_id: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          category: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          company_id?: string | null
          created_at?: string
          end_time: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          price: number
          professional_id: string
          rating?: number | null
          review?: string | null
          session_date: string
          start_time: string
          status?: Database["public"]["Enums"]["session_status"]
          student_id: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          category?: Database["public"]["Enums"]["professional_category"]
          city?: string | null
          company_id?: string | null
          created_at?: string
          end_time?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          price?: number
          professional_id?: string
          rating?: number | null
          review?: string | null
          session_date?: string
          start_time?: string
          status?: Database["public"]["Enums"]["session_status"]
          student_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "sessions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          created_at: string
          id: string
          lessons_completed: number
          preferred_categories: string[] | null
          upcoming_lessons: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          lessons_completed?: number
          preferred_categories?: string[] | null
          upcoming_lessons?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          lessons_completed?: number
          preferred_categories?: string[] | null
          upcoming_lessons?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: { Args: { _role: string; _user_id: string }; Returns: boolean }
    }
    Enums: {
      professional_category:
        | "driving_instructor"
        | "language_teacher"
        | "music_teacher"
        | "personal_trainer"
        | "tutor"
      provider_type: "independent" | "company"
      session_status:
        | "pending"
        | "confirmed"
        | "in_progress"
        | "completed"
        | "cancelled"
      transmission_type: "manual" | "automatic"
      user_role: "student" | "professional" | "school_admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      professional_category: [
        "driving_instructor",
        "language_teacher",
        "music_teacher",
        "personal_trainer",
        "tutor",
      ],
      provider_type: ["independent", "company"],
      session_status: [
        "pending",
        "confirmed",
        "in_progress",
        "completed",
        "cancelled",
      ],
      transmission_type: ["manual", "automatic"],
      user_role: ["student", "professional", "school_admin"],
    },
  },
} as const
