// Single source of truth for the section ids. ContentPanel (which renders
// the panels), Rail (which renders the nav) and terminalCommands (which
// resolves typed commands to them) all read from here — previously each
// kept its own array, and a mismatch failed silently rather than erroring.
export const TAB_IDS = ["about", "career", "education", "projects", "stack"]

// The tablist lives in Rail and the tabpanel lives in ContentPanel, so the
// ARIA id wiring crosses a component boundary. Building the ids here means
// neither side can drift from the other's naming.
export const tabButtonId = (id) => `tab-${id}`
export const tabPanelId = (id) => `panel-${id}`
