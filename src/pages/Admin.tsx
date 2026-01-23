import { Helmet } from "react-helmet-async";
import { Card } from "../components/ui/Card";

export function Admin() {
  return (
    <div className="section-container space-y-6">
      <Helmet>
        <title>Admin | VinoVeil</title>
      </Helmet>
      <h1 className="font-serif text-4xl">Admin dashboard</h1>
      <Card padding="lg">
        <p className="text-sm text-parchment/70">
          Admin tooling placeholder. Product and order management will live here for ADMINS group.
        </p>
      </Card>
    </div>
  );
}
