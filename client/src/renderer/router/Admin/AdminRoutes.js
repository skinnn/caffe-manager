/*
	Admin routes - Need to be atuhenticated as Admin to get
	this assets (if in production)
*/

// Admin Components
const AdminDashboard = require('@/views/admin/AdminDashboard').default
const AdminTaxes = require('@/views/admin/AdminTaxes').default
// Settings
const Settings = require('@/views/admin/settings/Settings').default
const EditSettings = require('@/views/admin/settings/EditSettings').default
// Storage-Manager
const AdminViewSubgroup = require('@/views/admin/storage-manager/ViewArticleSubgroup').default
const AdminEditStorage = require('@/views/admin/storage-manager/EditStorage').default
const AdminStorageList = require('@/views/admin/storage-manager/StorageList').default
const AdminArticleSubgroupList = require('@/views/admin/storage-manager/ArticleSubgroupList').default
const AdminCreateStorage = require('@/views/admin/storage-manager/CreateStorage').default
const AdminCreateArticle = require('@/views/admin/storage-manager/CreateArticle').default
const AdminEditArticle = require('@/views/admin/storage-manager/EditArticle').default
// Table-Manager
const AdminCurrentTable = require('@/views/admin/table-manager/AdminCurrentTable').default
const AdminTableList = require('@/views/admin/table-manager/AdminTableList').default
// Admin-Manager
const AdminCreateAdmin = require('@/views/admin/admin-manager/CreateAdmin').default
const AdminViewAdmin = require('@/views/admin/admin-manager/ViewAdmin').default
const AdminEditAdmin = require('@/views/admin/admin-manager/EditAdmin').default
const AdminAdminList = require('@/views/admin/admin-manager/AdminList').default
// User-Manager
const AdminCreateUser = require('@/views/admin/user-manager/CreateUser').default
const AdminUserList = require('@/views/admin/user-manager/UserList').default
const AdminEditUser = require('@/views/admin/user-manager/EditUser').default
const AdminViewUser = require('@/views/admin/user-manager/ViewUser').default

// Admin Routes
const routes = [
	{
		path: '/admin/home',
		name: 'admin-home',
		component: AdminDashboard,
		// TODO: Each route needs to be protected with requiresLogin meta
		meta: { requiresLogin: true }
	},
	{
		path: '/admin/user/create',
		name: 'admin-create-user',
		component: AdminCreateUser
	},
	{
		path: '/admin/register',
		name: 'admin-register',
		component: AdminCreateAdmin
	},
	{
		path: '/admin/settings',
		name: 'admin-settings',
		component: Settings
	},
	{
		path: '/admin/settings/edit',
		name: 'admin-edit-settings',
		component: EditSettings
	},
	{
		path: '/admin/tables',
		name: 'admin-table-list',
		component: AdminTableList
	},
	{
		path: '/admin/table/:tableId',
		name: 'admin-current-table',
		component: AdminCurrentTable
	},
	{
		path: '/admin/admin-list',
		name: 'admin-admin-list',
		component: AdminAdminList
	},
	{
		path: '/admin/user-list',
		name: 'admin-user-list',
		component: AdminUserList
	},
	{
		path: '/admin/:adminId',
		name: 'admin-view-admin',
		component: AdminViewAdmin
	},
	{
		path: '/admin/:userId',
		name: 'admin-view-user',
		component: AdminViewUser
	},
	{
		path: '/admin/taxes',
		name: 'admin-taxes',
		component: AdminTaxes
	},
	{
		path: '/admin/:adminId/edit',
		name: 'admin-edit-admin',
		component: AdminEditAdmin
	},
	{
		path: '/admin/user/:userId/edit',
		name: 'admin-edit-user',
		component: AdminEditUser
	},
	{
		path: '/admin/storage-list',
		name: 'admin-storage-list',
		component: AdminStorageList
	},
	{
		path: '/admin/storage/:storageId/subgroup-list',
		name: 'admin-storage-subgroup-list',
		component: AdminArticleSubgroupList
	},
	{
		path: '/admin/storage/create',
		name: 'admin-create-storage',
		component: AdminCreateStorage
	},
	{
		path: '/admin/storage/:storageId',
		name: 'admin-view-article-subgroups',
		component: AdminViewSubgroup
	},
	{
		path: '/admin/storage/:storageId/edit',
		name: 'admin-edit-storage',
		component: AdminEditStorage
	},
	{
		path: '/admin/storage/:storageId/article/create',
		name: 'admin-create-article',
		component: AdminCreateArticle
	},
	{
		path: '/admin/article/:articleId/edit',
		name: 'admin-edit-article',
		component: AdminEditArticle
	}
]

export default routes
