import { ConversionPredictions, PredictorOutput } from "./types";
import { JourneyEntry } from "../cross-app/journey-builder";

export class ConversionPredictor {
  /**
   * Estimates probabilities of conversions, return rates, and form actions.
   */
  public static predict(journey: JourneyEntry[]): ConversionPredictions {
    const totalEvents = journey.length;

    const buildOutput = (
      rawScore: number,
      evidence: string[],
      signals: string[]
    ): PredictorOutput<number> => {
      const confidence = Math.min(100, Math.max(0, Math.round(rawScore)));
      let certainty: "Low" | "Medium" | "High" = "Low";
      if (evidence.length >= 3 && confidence > 70) certainty = "High";
      else if (evidence.length >= 1 && confidence > 30) certainty = "Medium";

      return {
        value: confidence,
        confidence,
        certainty,
        evidence,
        supporting_signals: signals,
      };
    };

    // Calculate Form Completion
    const formStarts = journey.filter(e => e.event_type === "form_started").length;
    const formCompletes = journey.filter(e => e.event_type === "form_submitted").length;
    const formEvidence: string[] = [];
    const formSignals: string[] = [];
    if (formStarts > 0) {
      formEvidence.push(`Started filling ${formStarts} forms`);
      formSignals.push("FORM_START_BEHAVIOR");
    }
    if (formCompletes > 0) {
      formEvidence.push(`Successfully submitted ${formCompletes} forms`);
      formSignals.push("FORM_COMPLETION_ACTION");
    }
    const formScore = formCompletes > 0 ? 100 : formStarts * 35;
    const form_completion_probability = buildOutput(formScore, formEvidence, formSignals);

    // Calculate Guide Download Probability
    const downloadHits = journey.filter(e => e.event_type === "download_started").length;
    const guideViews = journey.filter(e => e.page.includes("research") || e.page.includes("books")).length;
    const dlEvidence: string[] = [];
    const dlSignals: string[] = [];
    if (downloadHits > 0) {
      dlEvidence.push(`Already downloaded ${downloadHits} guide documents`);
      dlSignals.push("DOWNLOAD_ACTION_ACTIVE");
    }
    if (guideViews > 0) {
      dlEvidence.push(`Viewed document library section ${guideViews} times`);
      dlSignals.push("RESEARCH_LIBRARY_VISITED");
    }
    const dlScore = downloadHits * 40 + guideViews * 15;
    const guide_download_probability = buildOutput(Math.min(100, dlScore), dlEvidence, dlSignals);

    // Calculate Property Enquiry Probability
    const propertyViews = journey.filter(e => e.event_type === "property_opened").length;
    const contactViews = journey.filter(e => e.page.includes("contact")).length;
    const enqEvidence: string[] = [];
    const enqSignals: string[] = [];
    if (propertyViews > 0) {
      enqEvidence.push(`Inspected ${propertyViews} distinct properties`);
      enqSignals.push("PROPERTY_VIEWS_CORRELATION");
    }
    if (contactViews > 0) {
      enqEvidence.push(`Visited contact address pages ${contactViews} times`);
      enqSignals.push("CONTACT_PAGE_VISITED");
    }
    const enqScore = propertyViews * 12 + contactViews * 25;
    const property_enquiry_probability = buildOutput(Math.min(100, enqScore), enqEvidence, enqSignals);

    // Calculate Return Visit Probability
    const sessionsList = new Set(journey.map(e => e.visitor_id));
    const pageViews = journey.filter(e => e.event_type === "page_view").length;
    const returnEvidence: string[] = [];
    const returnSignals: string[] = [];
    if (sessionsList.size > 1) {
      returnEvidence.push(`Returning visitor detected with ${sessionsList.size} linking profiles`);
      returnSignals.push("IDENTITY_LINKAGE_DETECTED");
    }
    if (pageViews > 5) {
      returnEvidence.push(`Active session containing ${pageViews} page views`);
      returnSignals.push("HIGH_PAGE_VIEWS_VOLUME");
    }
    const returnScore = sessionsList.size * 30 + pageViews * 5;
    const return_visit_probability = buildOutput(Math.min(100, returnScore), returnEvidence, returnSignals);

    // Contact Probability is the max score of forms/enquiries
    const contactScore = Math.max(form_completion_probability.value, property_enquiry_probability.value);
    const contact_probability = buildOutput(contactScore, ["Aggregated intent of form and listing interactions"], ["COMPUTED_CONTACT_WEIGHT"]);

    return {
      contact_probability,
      form_completion_probability,
      guide_download_probability,
      property_enquiry_probability,
      return_visit_probability,
    };
  }
}
export default ConversionPredictor;
