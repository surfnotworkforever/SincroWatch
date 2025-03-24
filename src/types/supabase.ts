export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      devices: {
        Row: {
          id: string;
          user_id: string;
          device_type: string;
          device_id: string;
          name: string | null;
          last_sync: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_type: string;
          device_id: string;
          name?: string | null;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_type?: string;
          device_id?: string;
          name?: string | null;
          last_sync?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          activity_type: string;
          start_time: string;
          end_time: string;
          duration: string;
          distance: number | null;
          calories: number | null;
          average_heart_rate: number | null;
          max_heart_rate: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id: string;
          activity_type: string;
          start_time: string;
          end_time: string;
          duration: string;
          distance?: number | null;
          calories?: number | null;
          average_heart_rate?: number | null;
          max_heart_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_id?: string;
          activity_type?: string;
          start_time?: string;
          end_time?: string;
          duration?: string;
          distance?: number | null;
          calories?: number | null;
          average_heart_rate?: number | null;
          max_heart_rate?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      metrics: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          metric_type: string;
          value: number;
          unit: string;
          timestamp: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id: string;
          metric_type: string;
          value: number;
          unit: string;
          timestamp: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_id?: string;
          metric_type?: string;
          value?: number;
          unit?: string;
          timestamp?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          device_id: string;
          start_time: string;
          end_time: string | null;
          session_type: string;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          device_id: string;
          start_time: string;
          end_time?: string | null;
          session_type: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          device_id?: string;
          start_time?: string;
          end_time?: string | null;
          session_type?: string;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
} 