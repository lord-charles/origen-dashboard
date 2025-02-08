import AdvanceConfigPage from "./advance-config";
import { getAdvanceConfig } from "@/services/advance-service";

export default async function SettingsAdvancePage() {
  const config = await getAdvanceConfig();

  return (
    <div>
      <AdvanceConfigPage initialConfig={config} />
    </div>
  );
}
