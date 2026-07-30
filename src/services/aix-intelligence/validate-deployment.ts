import { ConnectorAuth } from "./connector/connector-auth";
import { SchemaValidator } from "./governance/validator";
import { ApplicationRegistry } from "./connector/application-registry";
import { RealtimeConfigManager } from "./realtime/config";
import { PredictionEngine } from "./predictive/prediction-engine";
import { LearningEngine } from "./learning-engine";
import { DecisionEngine } from "./decision-engine";
import { QueryEngine } from "./query-engine";

export interface ValidationSummary {
  success: boolean;
  timestamp: string;
  checks: {
    name: string;
    passed: boolean;
    detail: string;
  }[];
}

export class DeploymentValidator {
  public static async validate(): Promise<ValidationSummary> {
    const checks: { name: string; passed: boolean; detail: string }[] = [];
    const timestamp = new Date().toISOString();

    // 1. Connector Auth Check
    try {
      const auth = ConnectorAuth.validateRequest(
        "aix-os",
        "mock-key",
        "mock-timestamp",
        "mock-nonce",
        "mock-signature"
      );
      checks.push({
        name: "Connector Authentication Engine",
        passed: auth !== null,
        detail: "Auth engine initialized and returns validation contracts.",
      });
    } catch (e: any) {
      checks.push({ name: "Connector Authentication Engine", passed: false, detail: e.message });
    }

    // 2. Schema Validator Check
    try {
      const mockEvent = {
        event_id: "evt_123",
        visitor_id: "vis_123",
        session_id: "ses_123",
        application: "aix-os",
        event_type: "page_view",
        page: "/test",
        timestamp: new Date().toISOString(),
        payload: {},
      };
      const val = SchemaValidator.validate(mockEvent);
      checks.push({
        name: "Telemetry Schema Validator",
        passed: val.status === "valid",
        detail: `Validates standard events successfully. Status: ${val.status}`,
      });
    } catch (e: any) {
      checks.push({ name: "Telemetry Schema Validator", passed: false, detail: e.message });
    }

    // 3. Application Registry Check
    try {
      const apps = ApplicationRegistry.load();
      const hasAixOs = apps.some(a => a.application_id === "aix-os");
      checks.push({
        name: "Ecosystem Connector Registry",
        passed: hasAixOs && apps.length >= 3,
        detail: `Found ${apps.length} registered apps: ${apps.map(a => a.application_id).join(", ")}`,
      });
    } catch (e: any) {
      checks.push({ name: "Ecosystem Connector Registry", passed: false, detail: e.message });
    }

    // 4. Real-time Config manager Check
    try {
      const flags = RealtimeConfigManager.getFlags();
      checks.push({
        name: "Realtime Config Flags",
        passed: typeof flags === "object" && flags.live_monitor !== undefined,
        detail: `Loaded configuration parameters: ${Object.keys(flags).length} variables configured.`,
      });
    } catch (e: any) {
      checks.push({ name: "Realtime Config Flags", passed: false, detail: e.message });
    }

    // 5. Prediction Engine Check
    try {
      const pred = PredictionEngine.compute("vis_test", []);
      checks.push({
        name: "Prediction Engine",
        passed: pred !== null && pred.snapshot !== undefined,
        detail: "Prediction engine evaluates visitor trajectories and generates scoring structures.",
      });
    } catch (e: any) {
      checks.push({ name: "Prediction Engine", passed: false, detail: e.message });
    }

    // 6. Learning Engine Check
    try {
      const learn = LearningEngine.learn("vis_test", [], {});
      checks.push({
        name: "Adaptive Learning Engine",
        passed: learn !== null && learn.maturity !== undefined,
        detail: "Learning engine parses timelines to calculate confidence weights.",
      });
    } catch (e: any) {
      checks.push({ name: "Adaptive Learning Engine", passed: false, detail: e.message });
    }

    // 7. Decision Engine Check
    try {
      const decs = DecisionEngine.evaluate("vis_test", [], {});
      checks.push({
        name: "Advisory Decision Engine",
        passed: decs !== null && decs.opportunityRank !== undefined,
        detail: "Decision engine computes advisory timing, priority queues, and expected value.",
      });
    } catch (e: any) {
      checks.push({ name: "Advisory Decision Engine", passed: false, detail: e.message });
    }

    // 8. Query Engine Check
    try {
      const query = await QueryEngine.execute("Show luxury buyers.");
      checks.push({
        name: "Intelligence Query Engine",
        passed: query !== null && query.confidence !== undefined,
        detail: `Query translator parsed input successfully. Confidence: ${query.confidence}%`,
      });
    } catch (e: any) {
      checks.push({ name: "Intelligence Query Engine", passed: false, detail: e.message });
    }

    const success = checks.every(c => c.passed);

    return {
      success,
      timestamp,
      checks,
    };
  }
}
export default DeploymentValidator;
