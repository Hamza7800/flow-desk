import { createAccessControl } from "better-auth/plugins/access";
import {
  defaultStatements,
  adminAc,
} from "better-auth/plugins/organization/access";

const statement = {
  ...defaultStatements,
  project: ["create", "update", "delete", "archive", "view", "manageMember"],
  issue: ["create", "update", "delete"],
  cycle: ["create", "update", "delete"],
  comment: ["create", "update", "delete"],
  label: ["create", "update", "delete"],
  team: ["create", "update", "delete", "manageMember"],
  teamData: ["view"],
} as const;

export const ac = createAccessControl(statement);

export const memberRole = ac.newRole({
  invitation: [],
  // TODO: Might FIX THIS SO USER SHOULD NOT JOIN AND LEAVE
  member: ["create", "update"],
  project: ["create", "update", "manageMember"],
  issue: ["create", "update"],
  comment: ["create", "update", "delete"],
  cycle: ["create", "update", "delete"],
  label: ["create"],
  team: [],
  teamData: [],
});

export const adminRole = ac.newRole({
  ...adminAc.statements,
  project: ["create", "update", "archive", "view", "manageMember"],
  issue: ["create", "update"],
  comment: ["create", "update"],
  cycle: ["create", "update"],
  label: ["create", "update"],
  team: ["create", "update", "manageMember"],
  teamData: ["view"],
});

export const ownerRole = ac.newRole({
  ...adminAc.statements,
  organization: ["update", "delete"],
  project: ["create", "update", "delete", "archive", "view", "manageMember"],
  issue: ["create", "update", "delete"],
  comment: ["create", "update", "delete"],
  cycle: ["create", "update", "delete"],
  label: ["create", "update", "delete"],
  team: ["create", "update", "delete", "manageMember"],
  teamData: ["view"],
});
