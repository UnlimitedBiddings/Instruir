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
      companies: {
        Row: {
          address: string | null
          city: string | null
          cnpj: string | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          logo_url: string | null
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
          logo_url?: string | null
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
          logo_url?: string | null
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
      professionals: {
        Row: {
          address: string | null
          background_verified: boolean | null
          bio: string | null
          category: Database["public"]["Enums"]["professional_category"]
          city: string | null
          cnh_verified: boolean | null
          company_id: string | null
          created_at: string
          credentials_verified: boolean | null
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
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
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
          company_id?: string | null
          created_at?: string
          credentials_verified?: boolean | null
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
