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
      app_usage_logs: {
        Row: {
          accessed_at: string
          app_key: string
          id: string
          user_id: string
        }
        Insert: {
          accessed_at?: string
          app_key: string
          id?: string
          user_id: string
        }
        Update: {
          accessed_at?: string
          app_key?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      free_trials: {
        Row: {
          app_key: string | null
          created_at: string
          duration_days: number
          expires_at: string
          granted_by: string | null
          id: string
          started_at: string
          status: string
          trial_type: string
          user_id: string
        }
        Insert: {
          app_key?: string | null
          created_at?: string
          duration_days?: number
          expires_at: string
          granted_by?: string | null
          id?: string
          started_at?: string
          status?: string
          trial_type?: string
          user_id: string
        }
        Update: {
          app_key?: string | null
          created_at?: string
          duration_days?: number
          expires_at?: string
          granted_by?: string | null
          id?: string
          started_at?: string
          status?: string
          trial_type?: string
          user_id?: string
        }
        Relationships: []
      }
      lifetime_access: {
        Row: {
          granted_at: string
          granted_by: string | null
          id: string
          notes: string | null
          user_id: string
        }
        Insert: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id: string
        }
        Update: {
          granted_at?: string
          granted_by?: string | null
          id?: string
          notes?: string | null
          user_id?: string
        }
        Relationships: []
      }
      platform_apps: {
        Row: {
          app_category: string
          app_description: string | null
          app_key: string
          app_name: string
          app_status: string
          app_url: string | null
          created_at: string
          id: string
          is_featured: boolean
          is_visible: boolean
          sort_order: number
        }
        Insert: {
          app_category?: string
          app_description?: string | null
          app_key: string
          app_name: string
          app_status?: string
          app_url?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          sort_order?: number
        }
        Update: {
          app_category?: string
          app_description?: string | null
          app_key?: string
          app_name?: string
          app_status?: string
          app_url?: string | null
          created_at?: string
          id?: string
          is_featured?: boolean
          is_visible?: boolean
          sort_order?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          theme_preference: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          theme_preference?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          theme_preference?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      sso_tokens: {
        Row: {
          app_key: string
          created_at: string
          expires_at: string
          id: string
          token: string
          used: boolean
          used_at: string | null
          user_email: string | null
          user_id: string
        }
        Insert: {
          app_key: string
          created_at?: string
          expires_at: string
          id?: string
          token: string
          used?: boolean
          used_at?: string | null
          user_email?: string | null
          user_id: string
        }
        Update: {
          app_key?: string
          created_at?: string
          expires_at?: string
          id?: string
          token?: string
          used?: boolean
          used_at?: string | null
          user_email?: string | null
          user_id?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          app_key: string | null
          billing_type: string
          created_at: string
          description: string | null
          id: string
          kiwify_url: string | null
          plan_name: string
          price_description: string | null
          status: string
        }
        Insert: {
          app_key?: string | null
          billing_type?: string
          created_at?: string
          description?: string | null
          id?: string
          kiwify_url?: string | null
          plan_name: string
          price_description?: string | null
          status?: string
        }
        Update: {
          app_key?: string | null
          billing_type?: string
          created_at?: string
          description?: string | null
          id?: string
          kiwify_url?: string | null
          plan_name?: string
          price_description?: string | null
          status?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          created_at: string
          description: string
          event_type: string
          id: string
        }
        Insert: {
          created_at?: string
          description: string
          event_type: string
          id?: string
        }
        Update: {
          created_at?: string
          description?: string
          event_type?: string
          id?: string
        }
        Relationships: []
      }
      user_app_access: {
        Row: {
          access_status: string
          app_key: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          access_status?: string
          app_key: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          access_status?: string
          app_key?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_app_access_app_key_fkey"
            columns: ["app_key"]
            isOneToOne: false
            referencedRelation: "platform_apps"
            referencedColumns: ["app_key"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_subscriptions: {
        Row: {
          app_key: string | null
          created_at: string
          expires_at: string | null
          id: string
          plan_id: string
          started_at: string
          status: string
          subscription_status: string
          user_id: string
        }
        Insert: {
          app_key?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id: string
          started_at?: string
          status?: string
          subscription_status?: string
          user_id: string
        }
        Update: {
          app_key?: string | null
          created_at?: string
          expires_at?: string | null
          id?: string
          plan_id?: string
          started_at?: string
          status?: string
          subscription_status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_logs: {
        Row: {
          customer_email: string | null
          event_type: string
          id: string
          product_name: string | null
          raw_payload: Json | null
          received_at: string
          status: string
        }
        Insert: {
          customer_email?: string | null
          event_type: string
          id?: string
          product_name?: string | null
          raw_payload?: Json | null
          received_at?: string
          status: string
        }
        Update: {
          customer_email?: string | null
          event_type?: string
          id?: string
          product_name?: string | null
          raw_payload?: Json | null
          received_at?: string
          status?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      cleanup_expired_sso_tokens: { Args: never; Returns: undefined }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
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
      app_role: ["admin", "user"],
    },
  },
} as const
