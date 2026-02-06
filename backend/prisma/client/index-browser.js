
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  detectRuntime,
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.10.0
 * Query Engine version: 5a9203d0590c951969e85a7d07215503f4672eb9
 */
Prisma.prismaVersion = {
  client: "5.10.0",
  engine: "5a9203d0590c951969e85a7d07215503f4672eb9"
}

Prisma.PrismaClientKnownRequestError = () => {
  throw new Error(`PrismaClientKnownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  throw new Error(`PrismaClientUnknownRequestError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  throw new Error(`PrismaClientRustPanicError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  throw new Error(`PrismaClientInitializationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  throw new Error(`PrismaClientValidationError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  throw new Error(`NotFoundError is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  throw new Error(`sqltag is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  throw new Error(`empty is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  throw new Error(`join is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  throw new Error(`raw is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  throw new Error(`Extensions.getExtensionContext is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  throw new Error(`Extensions.defineExtension is unable to be run ${runtimeDescription}.
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}

/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  ReadUncommitted: 'ReadUncommitted',
  ReadCommitted: 'ReadCommitted',
  RepeatableRead: 'RepeatableRead',
  Serializable: 'Serializable'
});

exports.Prisma.Activity_logsScalarFieldEnum = {
  id: 'id',
  admin_id: 'admin_id',
  action: 'action',
  entity_type: 'entity_type',
  entity_id: 'entity_id',
  details: 'details',
  ip_address: 'ip_address',
  created_at: 'created_at'
};

exports.Prisma.AddressesScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  label: 'label',
  street_address: 'street_address',
  city: 'city',
  state: 'state',
  country: 'country',
  postal_code: 'postal_code',
  phone: 'phone',
  is_default: 'is_default',
  created_at: 'created_at'
};

exports.Prisma.AdminsScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password_hash: 'password_hash',
  name: 'name',
  role: 'role',
  avatar: 'avatar',
  last_login: 'last_login',
  created_at: 'created_at',
  updated_at: 'updated_at',
  firebase_uid: 'firebase_uid'
};

exports.Prisma.App_configsScalarFieldEnum = {
  id: 'id',
  key: 'key',
  value: 'value',
  description: 'description',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Attribute_valuesScalarFieldEnum = {
  id: 'id',
  attribute_id: 'attribute_id',
  name: 'name',
  value: 'value',
  position: 'position',
  translations: 'translations'
};

exports.Prisma.AttributesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  public_name: 'public_name',
  type: 'type',
  translations: 'translations'
};

exports.Prisma.Blog_postsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  excerpt: 'excerpt',
  image: 'image',
  category: 'category',
  author: 'author',
  status: 'status',
  views: 'views',
  published_at: 'published_at',
  created_at: 'created_at',
  updated_at: 'updated_at',
  translations: 'translations'
};

exports.Prisma.BrandsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  logo: 'logo',
  description: 'description',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CarriersScalarFieldEnum = {
  id: 'id',
  name: 'name',
  logo: 'logo',
  delivery_time: 'delivery_time',
  description: 'description',
  is_free: 'is_free',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
  code: 'code',
  max_weight: 'max_weight',
  tracking_url: 'tracking_url',
  type: 'type'
};

exports.Prisma.Cart_itemsScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  product_id: 'product_id',
  quantity: 'quantity',
  created_at: 'created_at'
};

exports.Prisma.Cart_rulesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  description: 'description',
  code: 'code',
  priority: 'priority',
  is_active: 'is_active',
  starts_at: 'starts_at',
  ends_at: 'ends_at',
  min_amount: 'min_amount',
  total_available: 'total_available',
  total_per_user: 'total_per_user',
  free_shipping: 'free_shipping',
  reduction_percent: 'reduction_percent',
  reduction_amount: 'reduction_amount',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CategoryScalarFieldEnum = {
  id: 'id',
  name: 'name',
  slug: 'slug',
  description: 'description',
  imageUrl: 'imageUrl',
  parentId: 'parentId',
  isActive: 'isActive',
  displayOrder: 'displayOrder',
  createdAt: 'createdAt',
  metaTitle: 'metaTitle',
  metaDescription: 'metaDescription',
  translations: 'translations'
};

exports.Prisma.Chat_messagesScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  text: 'text',
  is_user: 'is_user',
  session_id: 'session_id'
};

exports.Prisma.Chat_sessionsScalarFieldEnum = {
  id: 'id',
  createdAt: 'createdAt',
  updatedAt: 'updatedAt',
  status: 'status',
  user_id: 'user_id'
};

exports.Prisma.Cms_pagesScalarFieldEnum = {
  id: 'id',
  title: 'title',
  slug: 'slug',
  content: 'content',
  meta_title: 'meta_title',
  meta_description: 'meta_description',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at',
  display_order: 'display_order',
  show_in_footer: 'show_in_footer',
  show_in_header: 'show_in_header',
  structured_content: 'structured_content',
  translations: 'translations'
};

exports.Prisma.CurrenciesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  iso_code: 'iso_code',
  symbol: 'symbol',
  exchange_rate: 'exchange_rate',
  is_default: 'is_default',
  is_active: 'is_active',
  updated_at: 'updated_at'
};

exports.Prisma.Customer_groupsScalarFieldEnum = {
  id: 'id',
  name: 'name',
  discount_pct: 'discount_pct',
  color: 'color',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.CustomersScalarFieldEnum = {
  id: 'id',
  first_name: 'first_name',
  last_name: 'last_name',
  email: 'email',
  password_hash: 'password_hash',
  phone: 'phone',
  avatar: 'avatar',
  role: 'role',
  is_active: 'is_active',
  created_at: 'created_at'
};

exports.Prisma.InvoicesScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  invoice_number: 'invoice_number',
  status: 'status',
  pdf_url: 'pdf_url',
  amount: 'amount',
  issued_at: 'issued_at',
  due_date: 'due_date',
  paid_at: 'paid_at'
};

exports.Prisma.LanguagesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  iso_code: 'iso_code',
  locale: 'locale',
  flag: 'flag',
  is_rtl: 'is_rtl',
  is_active: 'is_active',
  is_default: 'is_default',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Media_filesScalarFieldEnum = {
  id: 'id',
  filename: 'filename',
  original_name: 'original_name',
  path: 'path',
  mime_type: 'mime_type',
  size: 'size',
  alt_text: 'alt_text',
  folder: 'folder',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Newsletter_subscribersScalarFieldEnum = {
  id: 'id',
  email: 'email',
  is_active: 'is_active',
  created_at: 'created_at'
};

exports.Prisma.NotificationsScalarFieldEnum = {
  id: 'id',
  title: 'title',
  body: 'body',
  image_url: 'image_url',
  target: 'target',
  sent_at: 'sent_at',
  sent_by: 'sent_by'
};

exports.Prisma.Order_itemsScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  product_id: 'product_id',
  variant_id: 'variant_id',
  product_name: 'product_name',
  quantity: 'quantity',
  price: 'price',
  total_price: 'total_price'
};

exports.Prisma.Order_status_historyScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  status: 'status',
  note: 'note',
  created_by: 'created_by',
  created_at: 'created_at'
};

exports.Prisma.OrdersScalarFieldEnum = {
  id: 'id',
  order_number: 'order_number',
  customer_id: 'customer_id',
  status: 'status',
  total_amount: 'total_amount',
  subtotal: 'subtotal',
  tax_total: 'tax_total',
  shipping_cost: 'shipping_cost',
  shipping_address: 'shipping_address',
  payment_method: 'payment_method',
  created_at: 'created_at'
};

exports.Prisma.Product_variant_valuesScalarFieldEnum = {
  id: 'id',
  variant_id: 'variant_id',
  attribute_value_id: 'attribute_value_id'
};

exports.Prisma.Product_variantsScalarFieldEnum = {
  id: 'id',
  product_id: 'product_id',
  name: 'name',
  sku: 'sku',
  price: 'price',
  stock: 'stock',
  weight: 'weight',
  is_active: 'is_active'
};

exports.Prisma.ProductsScalarFieldEnum = {
  id: 'id',
  category_id: 'category_id',
  name: 'name',
  slug: 'slug',
  sku: 'sku',
  description: 'description',
  price: 'price',
  compare_at_price: 'compare_at_price',
  cost_price: 'cost_price',
  stock_quantity: 'stock_quantity',
  images: 'images',
  is_active: 'is_active',
  is_featured: 'is_featured',
  brand_id: 'brand_id',
  supplier_id: 'supplier_id',
  weight: 'weight',
  width: 'width',
  height: 'height',
  depth: 'depth',
  reference: 'reference',
  hs_code: 'hs_code',
  origin_country: 'origin_country',
  tax_rule_id: 'tax_rule_id',
  translations: 'translations',
  created_at: 'created_at'
};

exports.Prisma.ReviewsScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  product_id: 'product_id',
  rating: 'rating',
  comment: 'comment',
  is_verified: 'is_verified',
  created_at: 'created_at'
};

exports.Prisma.RmasScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  customer_id: 'customer_id',
  status: 'status',
  reason: 'reason',
  resolution: 'resolution',
  admin_notes: 'admin_notes',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Shipping_ratesScalarFieldEnum = {
  id: 'id',
  carrier_id: 'carrier_id',
  zone_id: 'zone_id',
  min_weight: 'min_weight',
  max_weight: 'max_weight',
  price: 'price'
};

exports.Prisma.Shipping_zonesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  countries: 'countries',
  is_active: 'is_active'
};

exports.Prisma.Stock_movementsScalarFieldEnum = {
  id: 'id',
  product_id: 'product_id',
  variant_id: 'variant_id',
  quantity: 'quantity',
  reason: 'reason',
  reference_id: 'reference_id',
  admin_id: 'admin_id',
  created_at: 'created_at'
};

exports.Prisma.Store_configScalarFieldEnum = {
  key: 'key',
  value: 'value',
  type: 'type',
  group: 'group',
  description: 'description',
  isPublic: 'isPublic',
  updated_at: 'updated_at'
};

exports.Prisma.SuppliersScalarFieldEnum = {
  id: 'id',
  name: 'name',
  contact_info: 'contact_info',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Tax_rulesScalarFieldEnum = {
  id: 'id',
  name: 'name',
  rate: 'rate',
  country: 'country',
  priority: 'priority',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.Ticket_messagesScalarFieldEnum = {
  id: 'id',
  ticket_id: 'ticket_id',
  senderType: 'senderType',
  senderId: 'senderId',
  message: 'message',
  is_internal: 'is_internal',
  created_at: 'created_at'
};

exports.Prisma.TicketsScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  order_id: 'order_id',
  subject: 'subject',
  status: 'status',
  priority: 'priority',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.TransactionsScalarFieldEnum = {
  id: 'id',
  order_id: 'order_id',
  amount: 'amount',
  currency: 'currency',
  provider: 'provider',
  provider_tx_id: 'provider_tx_id',
  status: 'status',
  metadata: 'metadata',
  created_at: 'created_at'
};

exports.Prisma.TranslationsScalarFieldEnum = {
  id: 'id',
  group: 'group',
  key: 'key',
  language: 'language',
  value: 'value',
  updated_at: 'updated_at'
};

exports.Prisma.CouponsScalarFieldEnum = {
  id: 'id',
  code: 'code',
  discount_type: 'discount_type',
  value: 'value',
  min_order_amount: 'min_order_amount',
  expiration_date: 'expiration_date',
  usage_limit: 'usage_limit',
  used_count: 'used_count',
  is_active: 'is_active',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

exports.Prisma.WishlistScalarFieldEnum = {
  id: 'id',
  customer_id: 'customer_id',
  product_id: 'product_id',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};
exports.admins_role = exports.$Enums.admins_role = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  EDITOR: 'EDITOR',
  SUPPORT: 'SUPPORT',
  FULFILLMENT: 'FULFILLMENT'
};

exports.blog_posts_status = exports.$Enums.blog_posts_status = {
  DRAFT: 'DRAFT',
  PUBLISHED: 'PUBLISHED',
  ARCHIVED: 'ARCHIVED'
};

exports.customers_role = exports.$Enums.customers_role = {
  customer: 'customer',
  admin: 'admin'
};

exports.invoices_status = exports.$Enums.invoices_status = {
  DRAFT: 'DRAFT',
  ISSUED: 'ISSUED',
  PAID: 'PAID',
  VOID: 'VOID',
  OVERDUE: 'OVERDUE'
};

exports.transactions_provider = exports.$Enums.transactions_provider = {
  STRIPE: 'STRIPE',
  PAYPAL: 'PAYPAL',
  MANUAL: 'MANUAL'
};

exports.transactions_status = exports.$Enums.transactions_status = {
  PENDING: 'PENDING',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
  REFUNDED: 'REFUNDED'
};

exports.Prisma.ModelName = {
  activity_logs: 'activity_logs',
  addresses: 'addresses',
  admins: 'admins',
  app_configs: 'app_configs',
  attribute_values: 'attribute_values',
  attributes: 'attributes',
  blog_posts: 'blog_posts',
  brands: 'brands',
  carriers: 'carriers',
  cart_items: 'cart_items',
  cart_rules: 'cart_rules',
  Category: 'Category',
  chat_messages: 'chat_messages',
  chat_sessions: 'chat_sessions',
  cms_pages: 'cms_pages',
  currencies: 'currencies',
  customer_groups: 'customer_groups',
  customers: 'customers',
  invoices: 'invoices',
  languages: 'languages',
  media_files: 'media_files',
  newsletter_subscribers: 'newsletter_subscribers',
  notifications: 'notifications',
  order_items: 'order_items',
  order_status_history: 'order_status_history',
  orders: 'orders',
  product_variant_values: 'product_variant_values',
  product_variants: 'product_variants',
  products: 'products',
  reviews: 'reviews',
  rmas: 'rmas',
  shipping_rates: 'shipping_rates',
  shipping_zones: 'shipping_zones',
  stock_movements: 'stock_movements',
  store_config: 'store_config',
  suppliers: 'suppliers',
  tax_rules: 'tax_rules',
  ticket_messages: 'ticket_messages',
  tickets: 'tickets',
  transactions: 'transactions',
  translations: 'translations',
  coupons: 'coupons',
  wishlist: 'wishlist'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        const runtime = detectRuntime()
        const edgeRuntimeName = {
          'workerd': 'Cloudflare Workers',
          'deno': 'Deno and Deno Deploy',
          'netlify': 'Netlify Edge Functions',
          'edge-light': 'Vercel Edge Functions or Edge Middleware',
        }[runtime]

        let message = 'PrismaClient is unable to run in '
        if (edgeRuntimeName !== undefined) {
          message += edgeRuntimeName + '. As an alternative, try Accelerate: https://pris.ly/d/accelerate.'
        } else {
          message += 'this browser environment, or has been bundled for the browser (running in `' + runtime + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
