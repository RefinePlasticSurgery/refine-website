import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Copy } from "lucide-react";
import { pricingData, type PricingItem } from "@/lib/pricing-data";
import { useToast } from "@/hooks/use-toast";
import { AdminLayout } from "@/admin/components/AdminLayout";

export const Pricing = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const { toast } = useToast();

  const categories = useMemo(() => {
    const cats = Array.from(new Set(pricingData.map((item) => item.category)));
    return cats.sort();
  }, []);

  const filteredPricing = useMemo(() => {
    return pricingData.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory = categoryFilter === "all" || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, categoryFilter]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-TZ", {
      style: "currency",
      currency: "TZS",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const copyPriceToClipboard = (price: number, name: string) => {
    const priceText = `${name}: ${formatPrice(price)}`;
    navigator.clipboard.writeText(priceText);
    toast({
      title: "Copied",
      description: `"${name}" price copied to clipboard`,
    });
  };

  return (
    <AdminLayout
      title="Pricing"
      description="Reference list for procedures — prices are managed in code / CMS."
      segment="Pricing"
      toolbar={
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search procedures…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
              aria-label="Search procedures"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 shrink-0 text-muted-foreground" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="h-10 w-full min-w-[200px] rounded-md border border-input bg-background px-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label="Filter by category"
            >
              <option value="all">All categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      }
    >
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            In view
          </p>
          <p className="mt-2 font-serif text-3xl font-bold">{filteredPricing.length}</p>
          <p className="mt-1 text-xs text-muted-foreground">of {pricingData.length} procedures</p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Average
          </p>
          <p className="mt-2 font-serif text-2xl font-bold text-primary">
            {filteredPricing.length > 0
              ? formatPrice(
                  filteredPricing.reduce((sum, item) => sum + item.price, 0) /
                    filteredPricing.length
                )
              : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Lowest
          </p>
          <p className="mt-2 font-serif text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {filteredPricing.length > 0
              ? formatPrice(Math.min(...filteredPricing.map((item) => item.price)))
              : "—"}
          </p>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Highest
          </p>
          <p className="mt-2 font-serif text-2xl font-bold text-rose-600 dark:text-rose-400">
            {filteredPricing.length > 0
              ? formatPrice(Math.max(...filteredPricing.map((item) => item.price)))
              : "—"}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm">
        {filteredPricing.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/30 hover:bg-muted/30">
                  <TableHead className="min-w-[250px]">Procedure</TableHead>
                  <TableHead className="min-w-[140px]">Category</TableHead>
                  <TableHead className="min-w-[140px] text-right">Price (TZS)</TableHead>
                  <TableHead className="w-[100px]">Copy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPricing.map((procedure: PricingItem) => (
                  <TableRow key={procedure.id} className="hover:bg-muted/20">
                    <TableCell>
                      <p className="font-medium">{procedure.name}</p>
                      {procedure.description && (
                        <p className="mt-1 text-sm text-muted-foreground">{procedure.description}</p>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="whitespace-nowrap">
                        {procedure.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary">
                      {formatPrice(procedure.price)}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyPriceToClipboard(procedure.price, procedure.name)}
                        aria-label={`Copy price for ${procedure.name}`}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="p-12 text-center text-muted-foreground">
            No procedures match your filters.
          </div>
        )}
      </div>

      <div className="mt-8 rounded-2xl border border-primary/20 bg-primary/5 p-5 text-sm text-foreground">
        <p>
          <strong className="text-primary">Note:</strong> Amounts are in Tanzanian Shillings (TZS).
          Use copy for quick paste into emails or messages.
        </p>
      </div>
    </AdminLayout>
  );
};
