import axios from "axios";

import type {
  PublicFreelancerInvite,
  PublicFreelancerInviteDecision,
  PublicFreelancerInviteResponse,
} from "../types/freelancerInvitePublic.types";

const API_URL =
  "http://localhost:3333";

/* =========================================================
   CARREGAR CONVITE PÚBLICO
========================================================= */

export async function getPublicFreelancerInvite(
  token: string,
) {
  const response =
    await axios.get<PublicFreelancerInvite>(
      `${API_URL}/freelancer-invites/public/${token}`,
    );

  return response.data;
}


/* =========================================================
   RESPONDER CONVITE
========================================================= */

export async function respondPublicFreelancerInvite(
  token: string,
  decision: PublicFreelancerInviteDecision,
) {
  const response =
    await axios.patch<PublicFreelancerInviteResponse>(
      `${API_URL}/freelancer-invites/public/${token}/respond`,
      {
        decision,
      },
    );

  return response.data;
}