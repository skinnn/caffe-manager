/*
	Admin routes - Need to be atuhenticated as Admin to get
	this assets (in production)
*/
import config from '@/config/config'
// Admin Components
import AdminDashboard from '@/views/admin/AdminDashboard'
import AdminTaxes from '@/views/admin/AdminTaxes'
// Settings
import Settings from '@/views/admin/settings/Settings'
import EditSettings from '@/views/admin/settings/EditSettings'
// Storage-Manager
import AdminViewSubgroup from '@/views/admin/storage-manager/ViewArticleSubgroup'
import AdminEditStorage from '@/views/admin/storage-manager/EditStorage'
import AdminStorageList from '@/views/admin/storage-manager/StorageList'
import AdminArticleSubgroupList from '@/views/admin/storage-manager/ArticleSubgroupList'
import AdminCreateStorage from '@/views/admin/storage-manager/CreateStorage'
import AdminCreateArticle from '@/views/admin/storage-manager/CreateArticle'
import AdminEditArticle from '@/views/admin/storage-manager/EditArticle'
// Table-Manager
import AdminCurrentTable from '@/views/admin/table-manager/AdminCurrentTable'
import AdminTableList from '@/views/admin/table-manager/AdminTableList'
// Admin-Manager
import AdminCreateAdmin from '@/views/admin/admin-manager/CreateAdmin'
import AdminViewAdmin from '@/views/admin/admin-manager/ViewAdmin'
import AdminEditAdmin from '@/views/admin/admin-manager/EditAdmin'
import AdminAdminList from '@/views/admin/admin-manager/AdminList'
// User-Manager
import AdminCreateUser from '@/views/admin/user-manager/CreateUser'
import AdminUserList from '@/views/admin/user-manager/UserList'
import AdminEditUser from '@/views/admin/user-manager/EditUser'
import AdminViewUser from '@/views/admin/user-manager/ViewUser'

// Admin Routes
const routes = [
	{
		path: '/admin/home',
		name: 'admin-home',
		component: AdminDashboard,
		meta: {
			title: 'Home'
		}
		// TODO: Each route needs to be protected with requiresAuth meta
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

// Should always be a bool - false, or string - 'admin'
let isAdminAuthRequired = config.authentication.admin ? 'admin' : false
if (process.env.NODE_ENV === 'production') isAdminAuthRequired = 'admin'
// Dynamically append authentication meta for all admin routes
routes.map(route => {
	route.meta = {
		...route.meta,
		requiresAuth: isAdminAuthRequired
	}
})

export default routes
