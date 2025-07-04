export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
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
      courses: {
        Row: {
          created_at: string
          duration_hours: number | null
          id: string
          link: string | null
          notes: string | null
          resource_name: string
          source_type: string
          subject_id: string
          trainer: string | null
          watched: boolean | null
        }
        Insert: {
          created_at?: string
          duration_hours?: number | null
          id?: string
          link?: string | null
          notes?: string | null
          resource_name: string
          source_type: string
          subject_id: string
          trainer?: string | null
          watched?: boolean | null
        }
        Update: {
          created_at?: string
          duration_hours?: number | null
          id?: string
          link?: string | null
          notes?: string | null
          resource_name?: string
          source_type?: string
          subject_id?: string
          trainer?: string | null
          watched?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "courses_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
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
      study_goals: {
        Row: {
          created_at: string
          goal_name: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          goal_name: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          goal_name?: string
          id?: string
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
      subjects: {
        Row: {
          created_at: string
          goal_id: string
          id: string
          subject_name: string
        }
        Insert: {
          created_at?: string
          goal_id: string
          id?: string
          subject_name: string
        }
        Update: {
          created_at?: string
          goal_id?: string
          id?: string
          subject_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "subjects_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "study_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      todos: {
        Row: {
          actual_duration: number | null
          assigned_date: string
          completed: boolean | null
          course_id: string
          created_at: string
          id: string
          notes: string | null
          parent_todo_id: string | null
          revision_round: number | null
          task_type: string
          title: string | null
          user_id: string
        }
        Insert: {
          actual_duration?: number | null
          assigned_date: string
          completed?: boolean | null
          course_id: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_todo_id?: string | null
          revision_round?: number | null
          task_type: string
          title?: string | null
          user_id: string
        }
        Update: {
          actual_duration?: number | null
          assigned_date?: string
          completed?: boolean | null
          course_id?: string
          created_at?: string
          id?: string
          notes?: string | null
          parent_todo_id?: string | null
          revision_round?: number | null
          task_type?: string
          title?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "todos_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "todos_parent_todo_id_fkey"
            columns: ["parent_todo_id"]
            isOneToOne: false
            referencedRelation: "todos"
            referencedColumns: ["id"]
          },
        ]
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
    }
    Views: {
      subject_stats: {
        Row: {
          actual_hours: number | null
          created_at: string | null
          expertise_level: string | null
          goal_id: string | null
          id: string | null
          planned_hours: number | null
          subject_name: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_user_subject_stats: {
        Args: { requesting_user_id?: string }
        Returns: {
          id: string
          subject_name: string
          goal_id: string
          created_at: string
          planned_hours: number
          actual_hours: number
          expertise_level: string
        }[]
      }
      mark_changelog_viewed: {
        Args: { changelog_entry_id: string }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
