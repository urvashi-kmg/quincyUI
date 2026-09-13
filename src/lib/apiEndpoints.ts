/**
 * Relative API endpoint paths for use with apiClient (which already has baseURL set).
 *
 * Full-URL auth endpoints (login, autoLogin, refreshToken) live in authService.ts
 * rather than here, because they are used with plain axios (not apiClient) and
 * need getConfig() at call time, not at module evaluation time.
 */

export const API_ENDPOINTS = {
  // User info (existing)
  getUserInfo: (userName: string) =>
    `/api/v1/NetAuth/GetUserVmByUserName?userName=${encodeURIComponent(userName)}`,

  // User Management
  getUsers: '/api/v1/NetAuth/GetUsersAsync',
  updateUser: '/api/v1/NetAuth/UpdateUser',

  // Roles
  getRoles: '/api/v1/NetAuth/Roles',
  getUsersByRoleId: (roleId: string) =>
    `/api/v1/NetAuth/GetUserByRoleId?roleId=${encodeURIComponent(roleId)}`,

  // Action Permissions
  getPermissions: '/api/v1/NetAuth/PermissionsAsync',
  addPermission: '/api/v1/NetAuth/AddPermission',
  updatePermission: '/api/v1/NetAuth/UpdatePermission',
  addPermissionsForRole: '/api/v1/NetAuth/AddPermissionsForRole',
  getPermissionsByRoleId: (roleId: string) =>
    `/api/v1/NetAuth/GetPermissionsByRoleId?roleId=${encodeURIComponent(roleId)}`,
  getUnlistedPermissionNames: '/api/v1/SystemManager/GetUnlistedRequestAndQueryNameList',
  getAuthReferenceLookups: (type: string) =>
    `/api/v1/NetAuth/GetAuthReferenceLookupsByTypeName?type=${encodeURIComponent(type)}`,

  // UI Permissions
  getUiPermissions: '/api/v1/NetAuth/UiPermissions',
  addUiPermission: '/api/v1/NetAuth/AddUiPermission',
  updateUiPermission: '/api/v1/NetAuth/UpdateUiPermission',
  addUiPermissionsForRole: '/api/v1/NetAuth/AddUiPermissionsForRole',
  getUiPermissionsByRoleId: (roleId: string) =>
    `/api/v1/NetAuth/GetUiPermissionsByRoleId?roleId=${encodeURIComponent(roleId)}`,

  // Policy
  listPolicies: '/api/v1/policy/GetQuotes',
  changePolicy: (id: string) => `/api/v1/ChangePolicy/${encodeURIComponent(id)}`,
  changeTransaction: '/api/v1/policy/ChangeTransaction',
  patchPolicy: '/api/v1/policy/PatchPolicy',
  cancellationGetPolicy: '/api/v1/policy/cancellation/get-policy',
  cancellationDeletePolicy: '/api/v1/policy/cancellation/delete-policy',
  cancellationHoldTransaction: '/api/v1/policy/cancellation/hold-transaction',
  cancellationDetails: '/api/v1/policy/cancellation/details',
  cancellationCancelPolicy: '/api/v1/policy/cancellation/cancel-policy',
  endorsementGetPolicy: '/api/v1/policy/endorse/get-policy',

  endorsementGetForms: '/api/v1/policy/endorse/get-forms',

  endorsementDeleteTransaction: '/api/v1/policy/endorse/delete-transaction',

  endorsementDeleteDriver: '/api/v1/policy/endorse/delete-driver',
  endorsementDeleteVehicle: '/api/v1/policy/endorse/delete-vehicle',

  // Rating / policy mutations
  savePolicyInfo: '/api/v3/policy/SavePolicyInfo',
  updateUnderwriterQuestions: '/api/v1/policy/UpdateUnderwriterQuestions',
  getQuoteNumber: '/api/v1/policy/GetQuoteNumber',

  // Vehicle / driver
  deleteVehicle: '/api/v1/policy/DeleteVehicle',
  deleteDriver: '/api/v1/policy/DeleteDriver',

  addVehicle: '/api/v1/policy/AddVehicle',

  getVehicleDetail: '/api/v1/policy/GetVehicleDetail',

  patchVehicle: '/api/v1/policy/PatchVehicle',

  locationMaster: '/api/v1/policy/vehicles/location-master',

  getDriverDetail: '/api/v1/policy/GetDriverDetail',

  patchDriver: '/api/v1/policy/PatchDriver',

  addDriver: '/api/v1/policy/AddDriver',

  queryNotepad: '/api/v1/policy/GetNotepads',

  getNotepadDetail: '/api/v1/policy/GetNotepadDetail',
  addNotepad: '/api/v1/policy/CreateNotepad',
  updateNotepad: '/api/v1/policy/UpdateNotepad', // PUT
  deleteNotepad: (noteId: string) => `/api/v1/policy/notepads/${encodeURIComponent(noteId)}`,

  queryTasks: '/api/v1/policy/GetTasks',

  queryTaskUsers: '/api/v1/policy/GetTaskUsers',

  createTask: '/api/v1/policy/CreateTask',

  updateTask: '/api/v1/policy/UpdateTask',

  referTask: '/api/v1/policy/ReferTask',

  referAllTasks: '/api/v1/policy/ReferAllTasks',

  viewTaskDetail: '/api/v1/policy/GetTaskDetail',

  closeTask: '/api/v1/policy/CloseTask',

  reopenTask: '/api/v1/policy/ReopenTask',

  // Transaction Action
  getActionMatrix: '/api/v1/TransactionAction/GetActionMatrix',
} as const;
