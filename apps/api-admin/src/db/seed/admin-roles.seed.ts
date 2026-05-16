import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { adminRoles } from "../schema/admin-roles.js";

const ALL_TRUE = {
	companies: { view: true, approve: true, reject: true },
	adminUsers: {
		view: true,
		create: true,
		updateRole: true,
		updatePermissions: true,
		deactivate: true,
	},
	settings: { view: true, edit: true },
};

const READ_ONLY = {
	companies: { view: true, approve: false, reject: false },
	adminUsers: {
		view: true,
		create: false,
		updateRole: false,
		updatePermissions: false,
		deactivate: false,
	},
	settings: { view: true, edit: false },
};

const ROLES = [
	{
		key: "owner",
		name: "Owner",
		description: "Acesso total à plataforma.",
		permissions: ALL_TRUE,
	},
	{
		key: "super_admin",
		name: "Super Admin",
		description: "Acesso total à plataforma.",
		permissions: ALL_TRUE,
	},
	{
		key: "developer",
		name: "Developer",
		description: "Acesso técnico: leitura de dados e configurações.",
		permissions: {
			companies: { view: true, approve: false, reject: false },
			adminUsers: {
				view: true,
				create: false,
				updateRole: false,
				updatePermissions: false,
				deactivate: false,
			},
			settings: { view: true, edit: true },
		},
	},
	{
		key: "manager",
		name: "Manager",
		description: "Gerenciamento de cadastros e criação de administradores.",
		permissions: {
			companies: { view: true, approve: true, reject: true },
			adminUsers: {
				view: true,
				create: true,
				updateRole: false,
				updatePermissions: false,
				deactivate: false,
			},
			settings: { view: true, edit: false },
		},
	},
	{
		key: "moderator",
		name: "Moderator",
		description: "Aprovação e recusa de cadastros de empresas.",
		permissions: {
			companies: { view: true, approve: true, reject: true },
			adminUsers: {
				view: true,
				create: false,
				updateRole: false,
				updatePermissions: false,
				deactivate: false,
			},
			settings: { view: true, edit: false },
		},
	},
	{
		key: "analyst",
		name: "Analyst",
		description: "Visualização de dados para análise.",
		permissions: READ_ONLY,
	},
	{
		key: "billing",
		name: "Billing",
		description: "Acesso a dados financeiros e configurações de cobrança.",
		permissions: {
			companies: { view: true, approve: false, reject: false },
			adminUsers: {
				view: true,
				create: false,
				updateRole: false,
				updatePermissions: false,
				deactivate: false,
			},
			settings: { view: true, edit: true },
		},
	},
	{
		key: "people",
		name: "People",
		description: "Gestão de usuários administradores.",
		permissions: {
			companies: { view: true, approve: false, reject: false },
			adminUsers: {
				view: true,
				create: true,
				updateRole: true,
				updatePermissions: true,
				deactivate: true,
			},
			settings: { view: true, edit: false },
		},
	},
	{
		key: "viewer",
		name: "Viewer",
		description: "Acesso somente leitura.",
		permissions: READ_ONLY,
	},
];

async function seed() {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) throw new Error("DATABASE_URL is not set");

	const client = postgres(connectionString);
	const db = drizzle(client);

	await db
		.insert(adminRoles)
		.values(ROLES)
		.onConflictDoUpdate({
			target: adminRoles.key,
			set: {
				name: sql`excluded.name`,
				description: sql`excluded.description`,
				permissions: sql`excluded.permissions`,
				updatedAt: new Date(),
			},
		});

	console.log("✓ Admin roles seeded");
	await client.end();
}

seed().catch((err) => {
	console.error(err);
	process.exit(1);
});
