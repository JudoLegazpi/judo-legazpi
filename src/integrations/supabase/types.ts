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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      documents: {
        Row: {
          category: string
          created_at: string
          file_url: string
          id: string
          published: boolean
          sort_order: number
          title_es: string
          title_eu: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          file_url: string
          id?: string
          published?: boolean
          sort_order?: number
          title_es: string
          title_eu?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          file_url?: string
          id?: string
          published?: boolean
          sort_order?: number
          title_es?: string
          title_eu?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          category: string
          created_at: string
          description_es: string | null
          description_eu: string | null
          end_date: string | null
          event_date: string
          id: string
          link_url: string | null
          location: string | null
          published: boolean
          title_es: string
          title_eu: string | null
          updated_at: string
        }
        Insert: {
          category?: string
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          end_date?: string | null
          event_date: string
          id?: string
          link_url?: string | null
          location?: string | null
          published?: boolean
          title_es: string
          title_eu?: string | null
          updated_at?: string
        }
        Update: {
          category?: string
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          end_date?: string | null
          event_date?: string
          id?: string
          link_url?: string | null
          location?: string | null
          published?: boolean
          title_es?: string
          title_eu?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      gallery_images: {
        Row: {
          caption_es: string | null
          caption_eu: string | null
          created_at: string
          id: string
          image_url: string
          sort_order: number
          updated_at: string
        }
        Insert: {
          caption_es?: string | null
          caption_eu?: string | null
          created_at?: string
          id?: string
          image_url: string
          sort_order?: number
          updated_at?: string
        }
        Update: {
          caption_es?: string | null
          caption_eu?: string | null
          created_at?: string
          id?: string
          image_url?: string
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      lopivi_buttons: {
        Row: {
          active: boolean
          bg_color: string
          created_at: string
          description_es: string | null
          description_eu: string | null
          icon: string
          icon_color: string
          id: string
          new_tab: boolean
          sort_order: number
          text_color: string
          text_size: string
          title_es: string
          title_eu: string
          updated_at: string
          url_es: string | null
          url_eu: string | null
        }
        Insert: {
          active?: boolean
          bg_color?: string
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          icon?: string
          icon_color?: string
          id?: string
          new_tab?: boolean
          sort_order?: number
          text_color?: string
          text_size?: string
          title_es?: string
          title_eu?: string
          updated_at?: string
          url_es?: string | null
          url_eu?: string | null
        }
        Update: {
          active?: boolean
          bg_color?: string
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          icon?: string
          icon_color?: string
          id?: string
          new_tab?: boolean
          sort_order?: number
          text_color?: string
          text_size?: string
          title_es?: string
          title_eu?: string
          updated_at?: string
          url_es?: string | null
          url_eu?: string | null
        }
        Relationships: []
      }
      schedules: {
        Row: {
          age_range: string | null
          created_at: string
          day_of_week: number
          end_time: string
          group_es: string
          group_eu: string | null
          id: string
          location: string | null
          sort_order: number
          start_time: string
          updated_at: string
        }
        Insert: {
          age_range?: string | null
          created_at?: string
          day_of_week?: number
          end_time: string
          group_es: string
          group_eu?: string | null
          id?: string
          location?: string | null
          sort_order?: number
          start_time: string
          updated_at?: string
        }
        Update: {
          age_range?: string | null
          created_at?: string
          day_of_week?: number
          end_time?: string
          group_es?: string
          group_eu?: string | null
          id?: string
          location?: string | null
          sort_order?: number
          start_time?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_images: {
        Row: {
          image_url: string | null
          key: string
          label: string
          updated_at: string
        }
        Insert: {
          image_url?: string | null
          key: string
          label: string
          updated_at?: string
        }
        Update: {
          image_url?: string | null
          key?: string
          label?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_settings: {
        Row: {
          key: string
          label: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          label?: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          label?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_texts: {
        Row: {
          key: string
          label: string
          updated_at: string
          value_es: string
          value_eu: string
        }
        Insert: {
          key: string
          label: string
          updated_at?: string
          value_es?: string
          value_eu?: string
        }
        Update: {
          key?: string
          label?: string
          updated_at?: string
          value_es?: string
          value_eu?: string
        }
        Relationships: []
      }
      staff: {
        Row: {
          belt: string | null
          bio_es: string | null
          bio_eu: string | null
          created_at: string
          id: string
          name: string
          photo_url: string | null
          qualifications: string | null
          role_es: string | null
          role_eu: string | null
          sort_order: number
          updated_at: string
        }
        Insert: {
          belt?: string | null
          bio_es?: string | null
          bio_eu?: string | null
          created_at?: string
          id?: string
          name: string
          photo_url?: string | null
          qualifications?: string | null
          role_es?: string | null
          role_eu?: string | null
          sort_order?: number
          updated_at?: string
        }
        Update: {
          belt?: string | null
          bio_es?: string | null
          bio_eu?: string | null
          created_at?: string
          id?: string
          name?: string
          photo_url?: string | null
          qualifications?: string | null
          role_es?: string | null
          role_eu?: string | null
          sort_order?: number
          updated_at?: string
        }
        Relationships: []
      }
      tournaments: {
        Row: {
          created_at: string
          description_es: string | null
          description_eu: string | null
          edition: string | null
          event_date: string | null
          id: string
          location: string | null
          poster_url: string | null
          published: boolean
          results_url: string | null
          slug: string
          title_es: string
          title_eu: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          edition?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          poster_url?: string | null
          published?: boolean
          results_url?: string | null
          slug: string
          title_es: string
          title_eu?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description_es?: string | null
          description_eu?: string | null
          edition?: string | null
          event_date?: string | null
          id?: string
          location?: string | null
          poster_url?: string | null
          published?: boolean
          results_url?: string | null
          slug?: string
          title_es?: string
          title_eu?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      app_role: "admin"
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
      app_role: ["admin"],
    },
  },
} as const
