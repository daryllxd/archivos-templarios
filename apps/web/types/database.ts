export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string | null;
          url: string | null;
          biography: string | null;
          country: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name?: string | null;
          url?: string | null;
          biography?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string | null;
          url?: string | null;
          biography?: string | null;
          country?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}
