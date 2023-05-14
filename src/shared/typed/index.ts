import { UserConfig as ViteConfig } from 'vite'

export type NavItemWithLink = {
  /**
   * nav 名称
   */
  text: string
  /**
   * nav 指向的地址
   */
  link: string
}

export interface Sidebar {
  [path: string]: SidebarGroup[]
}

export interface SidebarGroup {
  /**
   * 左侧的菜单名称
   */
  text?: string
  items: SidebarItem[]
}

export type SidebarItem =
  | { text: string; link: string }
  | { text: string; link?: string; items: SidebarItem[] }

export interface ThemeConfig {
  nav?: NavItemWithLink[]
  sidebar?: Sidebar
  footer?: Footer
}

export type Footer = {
  message: string
}
export interface UserConfig {
  /**
   * 网站的标题
   */
  title?: string
  /**
   * 网站的描述
   */
  description?: string
  themeConfig: Sidebar
  viteConfig: ViteConfig
}
