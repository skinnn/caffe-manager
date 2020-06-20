/*
	Admin routes - Need to be atuhenticated as  to get this assets
*/
import config from '@/config/config'
//  Dashboard
import Dashboard from '@/components/admin/dashboard/AdminDashboard'

/**
 * Pages
 */
import Index from '@/views/admin/dashboard/index'
// Settings
import Settings from '@/views/admin/dashboard/settings/Settings'
import EditSettings from '@/views/admin/dashboard/settings/EditSettings'
// Store
import ViewStore from '@/views/admin/dashboard/store/viewStore'
// Storage manager
// import ViewCategory from '@/views/admin/dashboard/storage-manager/ViewArticleCategory'
import ViewStorage from '@/views/admin/dashboard/storage-manager/ViewStorage'
import EditStorage from '@/views/admin/dashboard/storage-manager/EditStorage'
import StorageList from '@/views/admin/dashboard/storage-manager/StorageList'
import ArticleCategoryList from '@/views/admin/dashboard/storage-manager/ArticleCategoryList'
import CreateStorage from '@/views/admin/dashboard/storage-manager/CreateStorage'
import CreateArticle from '@/views/admin/dashboard/storage-manager/CreateArticle'
import EditArticle from '@/views/admin/dashboard/storage-manager/EditArticle'
// Table manager
import CurrentTable from '@/views/admin/dashboard/table-manager/AdminCurrentTable'
import TableList from '@/views/admin/dashboard/table-manager/AdminTableList'
// User manager
import CreateUser from '@/views/admin/dashboard/user-manager/CreateUser'
import UserList from '@/views/admin/dashboard/user-manager/UserList'
import EditUser from '@/views/admin/dashboard/user-manager/EditUser'
import ViewUser from '@/views/admin/dashboard/user-manager/ViewUser'
// Tax manager
import TaxesGraph from '@/views/admin/dashboard/taxes/tax-graph'
import TaxesSettings from '@/views/admin/dashboard/taxes/tax-settings'

//  Routes
const routes = [
	{
		path: '/admin',
		// redirect: '/admin/home',
		component: Dashboard,

		//  Dashboard pages
		children: [
			{
				path: 'home',
				name: 'admin-home',
				component: Index,
				meta: { title: 'Dashboard' }
			},
			{
				path: 'store',
				name: 'admin-store',
				component: ViewStore,
				meta: { title: 'Store' }
			},
			{
				path: 'user/create',
				name: 'admin-create-user',
				component: CreateUser,
				meta: { title: 'Create user' }
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
				path: 'table/list',
				name: 'admin-table-list',
				component: TableList,
				meta: { title: 'Admin tables' }
			},
			{
				path: 'table/:tableId',
				name: 'admin-current-table',
				component: CurrentTable,
				meta: { title: 'Current table' }
			},
			{
				path: 'user/list',
				name: 'admin-user-list',
				component: UserList,
				meta: { title: 'User list' }
			},
			{
				path: 'user/:userId',
				name: 'admin-view-user',
				component: ViewUser,
				meta: { title: 'View user' }
			},
			// Taxes
			{
				path: 'taxes/graph',
				name: 'admin-taxes-graph',
				component: TaxesGraph,
				meta: { title: 'Taxes | Graph' }
			},
			{
				path: 'taxes/settings',
				name: 'admin-taxes-settings',
				component: TaxesSettings,
				meta: { title: 'Taxes | Settings' }
			},
			{
				path: 'user/:userId/edit',
				name: 'admin-edit-user',
				component: EditUser,
				meta: { title: 'Edit user' }
			},
			{
				path: 'storage/list',
				name: 'admin-storage-list',
				component: StorageList,
				meta: { title: 'Storage list' }
			},
			{
				path: 'storage/create',
				name: 'admin-storage-create',
				component: CreateStorage,
				meta: { title: 'Create storage' }
			},
			{
				path: 'storage/:storageId',
				name: 'admin-storage-view',
				component: ViewStorage,
				meta: { title: 'Article categories' }
			},
			// {
			// 	path: 'storage/:storageId/category/:categoryId',
			// 	name: 'admin-view-article-subgroups',
			// 	component: ViewCategory,
			// 	meta: { title: 'View category' }
			// },
			{
				path: 'storage/:storageId/edit',
				name: 'admin-edit-storage',
				component: EditStorage,
				meta: { title: 'Edit storage' }
			},
			{
				path: 'storage/:storageId/article/create',
				name: 'admin-create-article',
				component: CreateArticle,
				meta: { title: 'Create article' }
			},
			{
				path: 'article/:articleId/edit',
				name: 'admin-edit-article',
				component: EditArticle,
				meta: { title: 'Edit article' }
			}
		]
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
