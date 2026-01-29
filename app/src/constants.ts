// Global Configuration

// Maximum nesting depth for groups (Root is depth 0)
// 2 means: Root Group (0) -> Group (1) -> Sub Group (2)
export const MAX_NESTING_DEPTH = 1; // NOTE: Currently set to 1 cuz backend doesn't support deeper nesting even tho it says it does (says 3, its actually 2)

// Maximum total sounds allowed in a profile
export const MAX_SOUND_LIMIT = 200;

// Auto-save delay in milliseconds
export const SAVE_TIMEOUT_MS = 3000;
