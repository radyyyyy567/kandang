import {

  UserOutlined,
  DeploymentUnitOutlined,
  BankOutlined,
  GoldOutlined,
  ProductOutlined,
  AuditOutlined,
} from "@ant-design/icons";
import { APP_PREFIX_PATH } from 'configs/AppConfig'


const dashBoardNavTree = [{
  key: "extra-pages-list",
  path: `${APP_PREFIX_PATH}/user-list`,
  title: "User List",
  icon: UserOutlined,
  breadcrumb: true,
  submenu: [],
},
{
  key: "Corperation",
  path: `${APP_PREFIX_PATH}/corperation`,
  title: "Corperations",
  icon: DeploymentUnitOutlined,
  breadcrumb: true,
  submenu: [
    {
      key: "position",
      path: `${APP_PREFIX_PATH}/position`,
      title: "Position",
      icon: "",
      breadcrumb: true,
      submenu: [],
    },
    {
      key: "division",
      path: `${APP_PREFIX_PATH}/division`,
      title: "Division",
      icon: "",
      breadcrumb: true,
      submenu: [],
    },
  ],
},
{
  key: "farm",
  path: `${APP_PREFIX_PATH}/farm`,
  title: "Farm",
  icon: BankOutlined,
  breadcrumb: true,
  submenu: [],
},
{
  key: "Hen House",
  path: `${APP_PREFIX_PATH}/henhouse`,
  title: "Hen House",
  icon: GoldOutlined,
  breadcrumb: true,
  submenu: [],
},
{
  key: "product",
  path: `${APP_PREFIX_PATH}/product`,
  title: "Product",
  icon: ProductOutlined,
  breadcrumb: true,
  submenu: [],
},
{
  key: "uprove",
  path: `${APP_PREFIX_PATH}/uprove`,
  title: "Uprove",
  icon: AuditOutlined,
  breadcrumb: true,
  submenu: [],
}]

const navigationConfig = [
  ...dashBoardNavTree
]

export default navigationConfig;
