import { supabase } from "@/lib/supabase";
import { Etalase, EtalaseCreateInput } from "@/types";

const ITEMS_PER_PAGE = 10;

export const etalaseService = {
  /**
   * Fetch etalases with pagination (infinite scroll)
   * @param offset - Starting index
   * @param limit - Number of items to fetch
   */
  async fetchEtalases(
    offset: number = 0,
    limit: number = ITEMS_PER_PAGE
  ): Promise<{ data: Etalase[]; hasMore: boolean }> {
    const { data, error } = await supabase
      .from("etalases")
      .select("*")
      .order("etalase_number", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data || [],
      hasMore: (data?.length || 0) === limit,
    };
  },

  /**
   * Search etalases by etalase_number
   * @param searchTerm - 3 digit number string
   * Sorted by etalase_number descending (newest/largest first)
   */
  async searchByNumber(searchTerm: string): Promise<Etalase[]> {
    const { data, error } = await supabase
      .from("etalases")
      .select("*")
      .ilike("etalase_number", `%${searchTerm}%`)
      .order("etalase_number", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Get the next etalase number (auto-increment)
   */
  async getNextEtalaseNumber(): Promise<string> {
    const { data, error } = await supabase
      .from("etalases")
      .select("etalase_number")
      .order("etalase_number", { ascending: false })
      .limit(1);

    if (error) {
      throw new Error(error.message);
    }

    if (!data || data.length === 0) {
      return "001";
    }

    const lastNumber = parseInt(data[0].etalase_number, 10);
    const nextNumber = lastNumber + 1;
    return nextNumber.toString().padStart(3, "0");
  },

  /**
   * Create a new etalase
   */
  async createEtalase(input: EtalaseCreateInput): Promise<Etalase> {
    const { data, error } = await supabase
      .from("etalases")
      .insert(input)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Upload thumbnail image to Supabase Storage
   */
  async uploadThumbnail(file: File): Promise<string> {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `thumbnails/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("etalase-thumbnails")
      .upload(filePath, file);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("etalase-thumbnails")
      .getPublicUrl(filePath);

    return data.publicUrl;
  },

  /**
   * Get all etalases (for admin table)
   * Sorted by etalase_number descending (newest/largest first)
   */
  async getAllEtalases(): Promise<Etalase[]> {
    const { data, error } = await supabase
      .from("etalases")
      .select("*")
      .order("etalase_number", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return data || [];
  },

  /**
   * Update an existing etalase
   */
  async updateEtalase(
    id: string,
    updates: { thumbnail_url?: string; affiliate_url?: string }
  ): Promise<Etalase> {
    const { data, error } = await supabase
      .from("etalases")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  /**
   * Delete an etalase
   */
  async deleteEtalase(id: string): Promise<void> {
    const { error } = await supabase.from("etalases").delete().eq("id", id);

    if (error) {
      throw new Error(error.message);
    }
  },
};
