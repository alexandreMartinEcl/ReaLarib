import agent from "../services/http";

const unitsUrl = "/api/units";
const listUrl = "/list";

/**
 * Get the list of journeys
 */
export async function getUnits() {
  const req = agent.online.get(unitsUrl + listUrl);
  try {
    const { body } = await req;
    return body;
  } catch (err) {
    return err;
  }
}
