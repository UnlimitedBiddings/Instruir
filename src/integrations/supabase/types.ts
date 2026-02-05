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
      audit_logs: {
        Row: {
          action: string
          created_at: string
          id: string
          ip_address: string | null
          new_data: Json | null
          old_data: Json | null
          record_id: string | null
          table_name: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          ip_address?: string | null
          new_data?: Json | null
          old_data?: Json | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
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
      professional_bank_accounts: {
        Row: {
          account_number: string
          account_type: string
          agency: string
          bank_code: string
          bank_name: string
          created_at: string
          holder_cpf: string
          holder_name: string
          id: string
          is_primary: boolean | null
          is_verified: boolean | null
          pix_key: string | null
          pix_key_type: string | null
          professional_id: string
          proof_url: string | null
          updated_at: string
        }
        Insert: {
          account_number: string
          account_type: string
          agency: string
          bank_code: string
          bank_name: string
          created_at?: string
          holder_cpf: string
          holder_name: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          pix_key?: string | null
          pix_key_type?: string | null
          professional_id: string
          proof_url?: string | null
          updated_at?: string
        }
        Update: {
          account_number?: string
          account_type?: string
          agency?: string
          bank_code?: string
          bank_name?: string
          created_at?: string
          holder_cpf?: string
          holder_name?: string
          id?: string
          is_primary?: boolean | null
          is_verified?: boolean | null
          pix_key?: string | null
          pix_key_type?: string | null
          professional_id?: string
          proof_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "professional_bank_accounts_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      professionals: {
        Row: {
          accepts_displacement: boolean | null
          address: string | null
          background_verified: boolean | null
          bio: string | null
          category: Database["public"]["Enums"]["professional_category"]
          cities_served: string[] | null
          city: string | null
          cnh_category: string | null
          cnh_document_url: string | null
          cnh_expiry: string | null
          cnh_number: string | null
          cnh_verified: boolean | null
          cnpj: string | null
          company_id: string | null
          created_at: string
          credentials_verified: boolean | null
          criminal_record_url: string | null
          criminal_record_verified: boolean | null
          displacement_fee_per_km: number | null
          employment_type: string | null
          experience_years: number | null
          id: string
          identity_verified: boolean | null
          latitude: number | null
          longitude: number | null
          neighborhoods_served: string[] | null
          price_per_hour: number
          profile_document_url: string | null
          provider_type: Database["public"]["Enums"]["provider_type"] | null
          rating: number | null
          review_count: number | null
          rg: string | null
          rg_issuer: string | null
          service_radius_km: number | null
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
          accepts_displacement?: boolean | null
          address?: string | null
          background_verified?: boolean | null
          bio?: string | null
          category: Database["public"]["Enums"]["professional_category"]
          cities_served?: string[] | null
          city?: string | null
          cnh_category?: string | null
          cnh_document_url?: string | null
          cnh_expiry?: string | null
          cnh_number?: string | null
          cnh_verified?: boolean | null
          cnpj?: string | null
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
          criminal_record_url?: string | null
          criminal_record_verified?: boolean | null
          displacement_fee_per_km?: number | null
          employment_type?: string | null
          experience_years?: number | null
          id?: string
          identity_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhoods_served?: string[] | null
          price_per_hour: number
          profile_document_url?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"] | null
          rating?: number | null
          review_count?: number | null
          rg?: string | null
          rg_issuer?: string | null
          service_radius_km?: number | null
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
          accepts_displacement?: boolean | null
          address?: string | null
          background_verified?: boolean | null
          bio?: string | null
          category?: Database["public"]["Enums"]["professional_category"]
          cities_served?: string[] | null
          city?: string | null
          cnh_category?: string | null
          cnh_document_url?: string | null
          cnh_expiry?: string | null
          cnh_number?: string | null
          cnh_verified?: boolean | null
          cnpj?: string | null
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
          criminal_record_url?: string | null
          criminal_record_verified?: boolean | null
          displacement_fee_per_km?: number | null
          employment_type?: string | null
          experience_years?: number | null
          id?: string
          identity_verified?: boolean | null
          latitude?: number | null
          longitude?: number | null
          neighborhoods_served?: string[] | null
          price_per_hour?: number
          profile_document_url?: string | null
          provider_type?: Database["public"]["Enums"]["provider_type"] | null
          rating?: number | null
          review_count?: number | null
          rg?: string | null
          rg_issuer?: string | null
          service_radius_km?: number | null
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
          address: string | null
          address_complement: string | null
          address_number: string | null
          avatar_url: string | null
          birth_date: string | null
          city: string | null
          cpf: string | null
          created_at: string
          email: string
          gender: string | null
          id: string
          name: string
          neighborhood: string | null
          phone: string | null
          privacy_accepted_at: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          terms_accepted_at: string | null
          updated_at: string
          user_id: string
          zip_code: string | null
        }
        Insert: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          gender?: string | null
          id?: string
          name: string
          neighborhood?: string | null
          phone?: string | null
          privacy_accepted_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id: string
          zip_code?: string | null
        }
        Update: {
          address?: string | null
          address_complement?: string | null
          address_number?: string | null
          avatar_url?: string | null
          birth_date?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          gender?: string | null
          id?: string
          name?: string
          neighborhood?: string | null
          phone?: string | null
          privacy_accepted_at?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          terms_accepted_at?: string | null
          updated_at?: string
          user_id?: string
          zip_code?: string | null
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
      vehicles: {
        Row: {
          brand: string
          chassis: string | null
          color: string
          created_at: string
          dpvat_paid: boolean | null
          has_ac: boolean | null
          has_dual_controls: boolean | null
          id: string
          image_url: string | null
          inspection_expiry: string | null
          inspection_url: string | null
          insurance_company: string | null
          insurance_expiry: string | null
          insurance_policy_number: string | null
          is_active: boolean | null
          is_primary: boolean | null
          model: string
          plate: string
          professional_id: string
          renavam: string | null
          transmission: string
          updated_at: string
          vehicle_document_url: string | null
          year: number
        }
        Insert: {
          brand: string
          chassis?: string | null
          color: string
          created_at?: string
          dpvat_paid?: boolean | null
          has_ac?: boolean | null
          has_dual_controls?: boolean | null
          id?: string
          image_url?: string | null
          inspection_expiry?: string | null
          inspection_url?: string | null
          insurance_company?: string | null
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          is_active?: boolean | null
          is_primary?: boolean | null
          model: string
          plate: string
          professional_id: string
          renavam?: string | null
          transmission: string
          updated_at?: string
          vehicle_document_url?: string | null
          year: number
        }
        Update: {
          brand?: string
          chassis?: string | null
          color?: string
          created_at?: string
          dpvat_paid?: boolean | null
          has_ac?: boolean | null
          has_dual_controls?: boolean | null
          id?: string
          image_url?: string | null
          inspection_expiry?: string | null
          inspection_url?: string | null
          insurance_company?: string | null
          insurance_expiry?: string | null
          insurance_policy_number?: string | null
          is_active?: boolean | null
          is_primary?: boolean | null
          model?: string
          plate?: string
          professional_id?: string
          renavam?: string | null
          transmission?: string
          updated_at?: string
          vehicle_document_url?: string | null
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
      }
      verification_history: {
        Row: {
          created_at: string
          document_url: string | null
          expiry_date: string | null
          id: string
          notes: string | null
          professional_id: string
          rejection_reason: string | null
          status: string
          updated_at: string
          verification_date: string | null
          verification_type: string
          verified_by: string | null
        }
        Insert: {
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          professional_id: string
          rejection_reason?: string | null
          status: string
          updated_at?: string
          verification_date?: string | null
          verification_type: string
          verified_by?: string | null
        }
        Update: {
          created_at?: string
          document_url?: string | null
          expiry_date?: string | null
          id?: string
          notes?: string | null
          professional_id?: string
          rejection_reason?: string | null
          status?: string
          updated_at?: string
          verification_date?: string | null
          verification_type?: string
          verified_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "verification_history_professional_id_fkey"
            columns: ["professional_id"]
            isOneToOne: false
            referencedRelation: "professionals"
            referencedColumns: ["id"]
          },
        ]
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
