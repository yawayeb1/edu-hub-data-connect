import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

type Bundle = {
  id: number;
  display_name: string;
  price_ghc: number;
  data_amount_gb: number;
};

interface BundleDropdownProps {
  network: "MTN_UP2U" | "AT_ISHARE" | "AT_BIGTIME" | "TELECEL" | "MTN";
  selectedBundle: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export function BundleDropdown({
  network,
  selectedBundle,
  onValueChange,
  disabled = false,
}: BundleDropdownProps) {
  const { data: bundles, isLoading, error } = useQuery({
    queryKey: ["bundles", network],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bundles")
        .select("id, display_name, price_ghc, data_amount_gb")
        .eq("network", network)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (error) {
        console.error("Supabase error:", error);
        console.error("Error details:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        throw error;
      }
      
      if (!data) {
        throw new Error("No data returned from Supabase");
      }
      
      return data as Bundle[];
    },
  });

  if (isLoading) {
    return (
      <div className="h-12 flex items-center justify-center border border-border rounded-md">
        <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const is404 = errorMessage.includes("404") || errorMessage.includes("not found");
    
    return (
      <div className="h-12 flex flex-col items-center justify-center border border-destructive rounded-md text-destructive text-xs p-2">
        <span className="font-medium">Error loading bundles</span>
        {is404 && (
          <span className="text-[10px] mt-1">
            Table may not exist. Check Supabase dashboard.
          </span>
        )}
      </div>
    );
  }

  if (!bundles || bundles.length === 0) {
    return (
      <div className="h-12 flex items-center justify-center border border-border rounded-md text-muted-foreground text-sm">
        No bundles available
      </div>
    );
  }

  return (
    <Select
      value={selectedBundle}
      onValueChange={onValueChange}
      disabled={disabled}
    >
      <SelectTrigger id="package" className="h-12">
        <SelectValue placeholder="Select package" />
      </SelectTrigger>
      <SelectContent>
        {bundles.map((bundle) => (
          <SelectItem key={bundle.id} value={bundle.id.toString()}>
            {bundle.display_name} - GH¢{bundle.price_ghc.toFixed(2)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

