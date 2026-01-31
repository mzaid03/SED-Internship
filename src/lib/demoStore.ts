import type { Task, TaskPriority } from '@/lib/types'

const GUEST_ID_KEY = 'task_manager_demo_guest_id'

function ensureWindow() {
	if (typeof window === 'undefined') {
		throw new Error('demoStore can only be used in the browser.')
	}
}

export function getOrCreateDemoGuestId() {
	ensureWindow()
	const existing = window.localStorage.getItem(GUEST_ID_KEY)
	if (existing) return existing
	const id = crypto.randomUUID()
	window.localStorage.setItem(GUEST_ID_KEY, id)
	return id
}

export function resetDemoGuestId() {
	ensureWindow()
	window.localStorage.removeItem(GUEST_ID_KEY)
}

function tasksKeyForGuest(guestId: string) {
	return `task_manager_demo_tasks_${guestId}`
}

export function loadDemoTasks(guestId: string): Task[] {
	ensureWindow()
	const raw = window.localStorage.getItem(tasksKeyForGuest(guestId))
	if (!raw) return []
	try {
		const parsed = JSON.parse(raw) as Task[]
		return Array.isArray(parsed) ? parsed : []
	} catch {
		return []
	}
}

function saveDemoTasks(guestId: string, tasks: Task[]) {
	ensureWindow()
	window.localStorage.setItem(tasksKeyForGuest(guestId), JSON.stringify(tasks))
}

export function createDemoTask(
	guestId: string,
	input: {
		title: string
		description?: string | null
		priority?: TaskPriority
		due_date?: string | null
	},
) {
	const newTask: Task = {
		id: crypto.randomUUID(),
		user_id: guestId,
		title: input.title,
		description: input.description ?? null,
		priority: input.priority ?? 'normal',
		due_date: input.due_date ?? null,
		is_complete: false,
		created_at: new Date().toISOString(),
	}

	const tasks = loadDemoTasks(guestId)
	saveDemoTasks(guestId, [newTask, ...tasks])
	return newTask
}

export function toggleDemoTaskComplete(guestId: string, taskId: string) {
	const tasks = loadDemoTasks(guestId)
	const next = tasks.map((t) => (t.id === taskId ? { ...t, is_complete: !t.is_complete } : t))
	saveDemoTasks(guestId, next)
	return next
}
