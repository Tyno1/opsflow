export const tickets = [
	{
		label: "Laptop cannot join VPN",
		path: "Incident · IT · Network",
		tag: "P2",
		status: "open" as const,
	},
	{
		label: "New starter access pack",
		path: "Request · People · Onboarding",
		tag: "P3",
		status: "waiting" as const,
	},
	{
		label: "Printer queue stalled",
		path: "Incident · Facilities · Print",
		tag: "P4",
		status: "resolved" as const,
	},
];

export const statusClassName = {
	open: "bg-primary",
	waiting: "bg-status-waiting",
	resolved: "bg-primary-hot",
} as const;

export const steps = [
	{
		step: "01",
		title: "Raise",
		copy: "Employees submit incidents and requests in one place.",
	},
	{
		step: "02",
		title: "Route",
		copy: "Classification and priority land work with the owning team.",
	},
	{
		step: "03",
		title: "Resolve",
		copy: "Queues stay current so ops can close the loop faster.",
	},
] as const;

export const metrics = [
	{ value: "48k+", label: "Tickets routed / month" },
	{ value: "12 min", label: "Median first response" },
	{ value: "94%", label: "Auto-classified correctly" },
	{ value: "180+", label: "Teams on Opsflow" },
] as const;

export const capabilities = [
	{
		title: "Smart classification",
		copy: "Incoming work is tagged by type, urgency, and owning department before an agent opens it.",
	},
	{
		title: "Org-aware queues",
		copy: "Each organization keeps clear boundaries while leadership still sees the throughput that matters.",
	},
	{
		title: "Audit-ready history",
		copy: "Every reassignment, comment, and status change stays attached to the ticket trail.",
	},
] as const;

export const logos = [
	"Northline",
	"Cascade Ops",
	"Helix Facilities",
	"Vertex People",
	"Harbor IT",
] as const;

export const testimonials = [
	{
		quote:
			"We replaced three inboxes with one desk. Routing stopped being a guessing game for our agents.",
		name: "Maya Chen",
		role: "Head of IT Operations",
		company: "Northline",
	},
	{
		quote:
			"Onboarding packs and facilities requests finally live in the same system without losing ownership.",
		name: "Jonah Reed",
		role: "Workplace Lead",
		company: "Cascade Ops",
	},
	{
		quote:
			"The queue view is calm enough for agents and clear enough for leadership standups.",
		name: "Priya Nair",
		role: "Service Desk Manager",
		company: "Harbor IT",
	},
] as const;

export const faqs = [
	{
		question: "Who is Opsflow for?",
		answer:
			"Internal IT, facilities, people, and ops teams that share intake but own different queues inside one organization.",
	},
	{
		question: "Can we keep department ownership?",
		answer:
			"Yes. Classification and routing assign work to the owning team while status stays visible across the desk.",
	},
	{
		question: "How long does setup take?",
		answer:
			"Most teams are live after connecting identity, inviting owners, and mapping a few categories—often within a day.",
	},
	{
		question: "Does Opsflow replace our identity provider?",
		answer:
			"No. Sign-in stays with your existing Entra / CIAM tenant. Opsflow provisions the app session after authentication.",
	},
	{
		question: "What happens if we outgrow the Team plan?",
		answer:
			"Move to Organization when more departments join the same intake. Seats and queues scale without a migration project.",
	},
] as const;
