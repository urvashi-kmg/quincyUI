// Re-exported at the global level because permissions/roles are consumed
// by shared layout components (Sidebar, RequireAuth) outside the auth
// feature itself. Prefer feature-local types by default — only lift a
// type here when 2+ unrelated features need it.
export interface Permission {
  resource: string;
  actions: Array<'read' | 'write' | 'delete'>;
}
