/*
	Admin routes - Need to be atuhenticated as Admin to get this assets
*/
import config from '@/config/config'
// Admin Dashboard
import AdminDashboard from '@/components/admin/dashboard/AdminDashboard'

/**
 * Pages
 */
import Index from '@/views/admin/dashboard/index'
// Settings
import Settings from '@/views/admin/dashboard/settings/Settings'
import EditSettings from '@/views/admin/dashboard/settings/EditSettings'
// Storage manager
import AdminViewSubgroup from '@/views/admin/dashboard/storage-manager/ViewArticleSubgroup'
import AdminEditStorage from '@/views/admin/dashboard/storage-manager/EditStorage'
import AdminStorageList from '@/views/admin/dashboard/storage-manager/StorageList'
import AdminArticleSubgroupList from '@/views/admin/dashboard/storage-manager/ArticleSubgroupList'
import AdminCreateStorage from '@/views/admin/dashboard/storage-manager/CreateStorage'
import AdminCreateArticle from '@/views/admin/dashboard/storage-manager/CreateArticle'
import AdminEditArticle from '@/views/admin/dashboard/storage-manager/EditArticle'
// Table manager
import AdminCurrentTable from '@/views/admin/dashboard/table-manager/AdminCurrentTable'
import AdminTableList from '@/views/admin/dashboard/table-manager/AdminTableList'
// Admin manager
import AdminCreateAdmin from '@/views/admin/dashboard/admin-manager/CreateAdmin'
import AdminViewAdmin from '@/views/admin/dashboard/admin-manager/ViewAdmin'
import AdminEditAdmin from '@/views/admin/dashboard/admin-manager/EditAdmin'
import AdminAdminList from '@/views/admin/dashboard/admin-manager/AdminList'
// User manager
import AdminCreateUser from '@/views/admin/dashboard/user-manager/CreateUser'
import AdminUserList from '@/views/admin/dashboard/user-manager/UserList'
import AdminEditUser from '@/views/admin/dashboard/user-manager/EditUser'
import AdminViewUser from '@/views/admin/dashboard/user-manager/ViewUser'
// Tax manager
import AdminTaxesGraph from '@/views/admin/dashboard/taxes/tax-graph'
import AdminTaxesSettings from '@/views/admin/dashboard/taxes/tax-settings'

// Admin Routes
const routes = [
	{
		path: '/admin',
		// redirect: '/admin/home',
		component: AdminDashboard,

		// Admin Dashboard pages
		children: [
			{
				path: 'home',
				name: 'admin-home',
				component: Index,
				meta: { title: 'Dashboard' }
			},
			{
				path: 'user/create',
				name: 'admin-create-user',
				component: AdminCreateUser,
				meta: { title: 'Create user' }
			},
			{
				path: 'register',
				name: 'admin-register',
				component: AdminCreateAdmin,
				meta: { title: 'Create admin' }
			},
			{
				path: 'settings',
				name: 'admin-settings',
				component: Settings,
				meta: { title: 'Settings' }
			},
			{
				path: 'settings/edit',
				name: 'admin-edit-settings',
				component: EditSettings,
				meta: { title: 'Edit settings' }
			},
			{
				path: 'tables',
				name: 'admin-table-list',
				component: AdminTableList,
				meta: { title: 'Admin tables' }
			},
			{
				path: 'table/:tableId',
				name: 'admin-current-table',
				component: AdminCurrentTable,
				meta: { title: 'Current table' }
			},
			// {
			// 	path: '/admin/list',
			// 	name: 'admin-admin-list',
			// 	component: AdminAdminList,
			// 	meta: { title: 'Admin list' }
			// },
			{
				path: 'user/list',
				name: 'admin-user-list',
				component: AdminUserList,
				meta: { title: 'User list' }
			},
			// {
			// 	path: 'admin/:adminId',
			// 	name: 'admin-view-admin',
			// 	component: AdminViewAdmin,
			// 	meta: { title: 'View admin' }
			// },
			{
				path: 'user/:userId',
				name: 'admin-view-user',
				component: AdminViewUser,
				meta: { title: 'View user' }
			},
			// Taxes
			{
				path: 'taxes/graph',
				name: 'admin-taxes-graph',
				component: AdminTaxesGraph,
				meta: { title: 'Taxes | Graph' }
			},
			{
				path: 'taxes/settings',
				name: 'admin-taxes-settings',
				component: AdminTaxesSettings,
				meta: { title: 'Taxes | Settings' }
			},
			{
				path: ':adminId/edit',
				name: 'admin-edit-admin',
				component: AdminEditAdmin,
				meta: { title: 'Edit admin' }
			},
			{
				path: 'user/:userId/edit',
				name: 'admin-edit-user',
				component: AdminEditUser,
				meta: { title: 'Edit user' }
			},
			{
				path: 'storage/list',
				name: 'admin-storage-list',
				component: AdminStorageList,
				meta: { title: 'Storage list' }
			},
			{
				path: 'storage/:storageId/subgroup-list',
				name: 'admin-storage-subgroup-list',
				component: AdminArticleSubgroupList,
				meta: { title: 'Article categories' }
			},
			{
				path: 'storage/create',
				name: 'admin-create-storage',
				component: AdminCreateStorage,
				meta: { title: 'Create storage' }
			},
			{
				path: 'storage/:storageId',
				name: 'admin-view-article-subgroups',
				component: AdminViewSubgroup,
				meta: { title: 'View category' }
			},
			{
				path: 'storage/:storageId/edit',
				name: 'admin-edit-storage',
				component: AdminEditStorage,
				meta: { title: 'Edit storage' }
			},
			{
				path: 'storage/:storageId/article/create',
				name: 'admin-create-article',
				component: AdminCreateArticle,
				meta: { title: 'Create article' }
			},
			{
				path: 'article/:articleId/edit',
				name: 'admin-edit-article',
				component: AdminEditArticle,
				meta: { title: 'Edit article' }
			}
		]
	}		
]

// const routes = [
// 	{
// 		path: '/admin',
// 		// name: 'admin-home',
// 		// redirect: '/admin/applicants',
// 		component: ADashboard,

// 		// Admin Dashboard pages
// 		children: [
// 			// Admin account page
// 			{
// 				path: '/index',
// 				name: 'admin-home',
// 				component: Index,
// 				meta: {
// 					title: 'Index'
// 				}
// 			},
// 			{
// 				path: '/user/create',
// 				name: 'admin-create-user',
// 				component: CreateUser,
// 				meta: { title: 'Create user' }
// 			},
// 			{
// 				path: '/admin/register',
// 				name: 'admin-register',
// 				component: CreateAdmin,
// 				meta: { title: 'Create user' }
// 			},
// 			{
// 				path: '/admin/settings',
// 				name: 'admin-settings',
// 				component: CreateAdmin,
// 				meta: { title: 'Create user' }
// 			}
// 		]
// 	}
// ]

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
