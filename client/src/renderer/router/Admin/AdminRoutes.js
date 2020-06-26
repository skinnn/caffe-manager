/*
	Admin routes - Need to be atuhenticated as  to get this assets
*/
import config from '@/config/config'
//  Dashboard component
import AdminDashboard from '@/components/dashboard/admin/AdminDashboard'

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
// import ViewCategory from '@/views/admin/dashboard/storages/ViewArticleCategory'
import CreateStorage from '@/views/admin/dashboard/storages/CreateStorage'
import ViewStorage from '@/views/admin/dashboard/storages/ViewStorage'
import ViewStorageDetails from '@/views/admin/dashboard/storages/ViewStorageDetails'
import EditStorage from '@/views/admin/dashboard/storages/EditStorage'
import StorageList from '@/views/admin/dashboard/storages/StorageList'
// Articles
import CreateArticle from '@/views/admin/dashboard/storages/CreateArticle'
import EditArticle from '@/views/admin/dashboard/storages/EditArticle'
import ArticleCategoryList from '@/views/admin/dashboard/storages/ArticleCategoryList'
import ArticleList from '@/views/admin/dashboard/articles/ArticleList'
import ArticleCreate from '@/views/admin/dashboard/articles/ArticleCreate'
// Categories
import CategoryList from '@/views/admin/dashboard/articles/CategoryList'
// Table manager
import CurrentTable from '@/views/admin/dashboard/tables/AdminCurrentTable'
import TableList from '@/views/admin/dashboard/tables/AdminTableList'
// User manager
import CreateUser from '@/views/admin/dashboard/users/CreateUser'
import UserList from '@/views/admin/dashboard/users/UserList'
import ViewUser from '@/views/admin/dashboard/users/ViewUser'
// Tax manager
import TaxesGraph from '@/views/admin/dashboard/taxes/tax-graph'
import TaxesSettings from '@/views/admin/dashboard/taxes/tax-settings'

//  Routes
const routes = [
	{
		path: '/admin',
		// redirect: '/admin/home',
		component: AdminDashboard,

		//  Dashboard pages
		children: [
			{
				path: 'home',
				name: 'admin-home',
				component: Index,
				meta: { title: 'Dashboard' }
			},
			// My account
			{
				path: 'account/:userId',
				name: 'admin-account',
				component: ViewUser,
				meta: { title: 'My account' }
			},
			// Store
			{
				path: 'store',
				name: 'admin-store',
				component: ViewStore,
				meta: { title: 'Store' }
			},
			// Settings
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
			// Storage
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
				meta: { title: 'Storage items' }
			},
			{
				path: 'storage/:storageId/details',
				name: 'admin-storage-view-details',
				component: ViewStorageDetails,
				meta: { title: 'Storage details' }
			},
			// {
			// 	path: 'storage/:storageId/edit',
			// 	name: 'admin-edit-storage',
			// 	component: EditStorage,
			// 	meta: { title: 'Edit storage' }
			// },
			// {
			// 	path: 'storage/:storageId/category/:categoryId',
			// 	name: 'admin-view-article-subgroups',
			// 	component: ViewCategory,
			// 	meta: { title: 'View category' }
			// },
			// {
			// 	path: 'storage/:storageId/article/create',
			// 	name: 'admin-create-article',
			// 	component: CreateArticle,
			// 	meta: { title: 'Create article' }
			// },
			// {
			// 	path: 'article/:articleId/edit',
			// 	name: 'admin-edit-article',
			// 	component: EditArticle,
			// 	meta: { title: 'Edit article' }
			// },
			// Articles
			{
				path: 'articles',
				name: 'admin-article-list',
				component: ArticleList,
				meta: { title: 'Article list' }
			},
			{
				path: 'articles/create',
				name: 'admin-article-create',
				component: ArticleCreate,
				meta: { title: 'Create article' }
			},
			// Categories
			{
				path: 'categories',
				name: 'admin-category-list',
				component: CategoryList,
				meta: { title: 'Categories' }
			},
			// Tables
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
			// Users
			{
				path: 'user/create',
				name: 'admin-create-user',
				component: CreateUser,
				meta: { title: 'Create user' }
			},
			{
				path: 'user/list',
				name: 'admin-user-list',
				component: UserList,
				meta: { title: 'User list' }
			},
			{
				path: 'user/:userId',
				props: true,
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
