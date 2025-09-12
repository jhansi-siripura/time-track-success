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
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      app_changelog: {
        Row: {
          change_type: string
          created_at: string
          description: string
          id: string
          is_published: boolean
          title: string
          updated_at: string
          version: string
        }
        Insert: {
          change_type?: string
          created_at?: string
          description: string
          id?: string
          is_published?: boolean
          title: string
          updated_at?: string
          version: string
        }
        Update: {
          change_type?: string
          created_at?: string
          description?: string
          id?: string
          is_published?: boolean
          title?: string
          updated_at?: string
          version?: string
        }
        Relationships: []
      }
      learning_matrix_unknown: {
        Row: {
          created_at: string
          estimated_hours: number | null
          id: string
          priority_category: Database["public"]["Enums"]["learning_priority"]
          subject_name: string
          topic_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          estimated_hours?: number | null
          id?: string
          priority_category: Database["public"]["Enums"]["learning_priority"]
          subject_name: string
          topic_name?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          estimated_hours?: number | null
          id?: string
          priority_category?: Database["public"]["Enums"]["learning_priority"]
          subject_name?: string
          topic_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pomodoro_settings: {
        Row: {
          auto_start_breaks: boolean
          auto_start_pomodoros: boolean
          created_at: string
          cycles_until_long_break: number
          focus_duration: number
          id: string
          long_break_duration: number
          short_break_duration: number
          sound_focus: string | null
          sound_long_break: string | null
          sound_short_break: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          created_at?: string
          cycles_until_long_break?: number
          focus_duration?: number
          id?: string
          long_break_duration?: number
          short_break_duration?: number
          sound_focus?: string | null
          sound_long_break?: string | null
          sound_short_break?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_start_breaks?: boolean
          auto_start_pomodoros?: boolean
          created_at?: string
          cycles_until_long_break?: number
          focus_duration?: number
          id?: string
          long_break_duration?: number
          short_break_duration?: number
          sound_focus?: string | null
          sound_long_break?: string | null
          sound_short_break?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revision_streaks: {
        Row: {
          completed: boolean
          created_at: string
          date: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed?: boolean
          created_at?: string
          date: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed?: boolean
          created_at?: string
          date?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      study_logs: {
        Row: {
          achievements: string | null
          created_at: string | null
          date: string | null
          duration: number | null
          id: number
          images: string[] | null
          lesson: string | null
          notes: string | null
          pomodoro_cycle: number | null
          session_type: string | null
          source: string | null
          subject: string | null
          time: string | null
          topic: string | null
          user_id: string
        }
        Insert: {
          achievements?: string | null
          created_at?: string | null
          date?: string | null
          duration?: number | null
          id?: number
          images?: string[] | null
          lesson?: string | null
          notes?: string | null
          pomodoro_cycle?: number | null
          session_type?: string | null
          source?: string | null
          subject?: string | null
          time?: string | null
          topic?: string | null
          user_id: string
        }
        Update: {
          achievements?: string | null
          created_at?: string | null
          date?: string | null
          duration?: number | null
          id?: number
          images?: string[] | null
          lesson?: string | null
          notes?: string | null
          pomodoro_cycle?: number | null
          session_type?: string | null
          source?: string | null
          subject?: string | null
          time?: string | null
          topic?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_changelog_views: {
        Row: {
          changelog_id: string
          id: string
          user_id: string
          viewed_at: string
        }
        Insert: {
          changelog_id: string
          id?: string
          user_id: string
          viewed_at?: string
        }
        Update: {
          changelog_id?: string
          id?: string
          user_id?: string
          viewed_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_changelog_views_changelog_id_fkey"
            columns: ["changelog_id"]
            isOneToOne: false
            referencedRelation: "app_changelog"
            referencedColumns: ["id"]
          },
        ]
      }
      youtube_summaries: {
        Row: {
          created_at: string
          duration: number | null
          id: string
          summary: string
          tags: string[] | null
          transcript: string
          updated_at: string
          user_id: string
          video_id: string
          video_thumbnail: string | null
          video_title: string
          video_url: string
        }
        Insert: {
          created_at?: string
          duration?: number | null
          id?: string
          summary: string
          tags?: string[] | null
          transcript: string
          updated_at?: string
          user_id: string
          video_id: string
          video_thumbnail?: string | null
          video_title: string
          video_url: string
        }
        Update: {
          created_at?: string
          duration?: number | null
          id?: string
          summary?: string
          tags?: string[] | null
          transcript?: string
          updated_at?: string
          user_id?: string
          video_id?: string
          video_thumbnail?: string | null
          video_title?: string
          video_url?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      mark_changelog_viewed: {
        Args: { changelog_entry_id: string }
        Returns: undefined
      }
    }
    Enums: {
      learning_priority:
        | "job-critical"
        | "important-not-urgent"
        | "curious-emerging"
        | "nice-to-know"
      roi_level: "high" | "medium" | "low" | "unknown"
      urgency_level: "high" | "medium" | "low"
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
      learning_priority: [
        "job-critical",
        "important-not-urgent",
        "curious-emerging",
        "nice-to-know",
      ],
      roi_level: ["high", "medium", "low", "unknown"],
      urgency_level: ["high", "medium", "low"],
    },
  },
} as const
