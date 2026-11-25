import React, { useEffect, useState } from 'react';
import { useOpenRouterSettings, useSetupStatus } from '../services/studioQueries';
import { Cpu, Disc, Layers, Library, Moon, Newspaper, ScrollText, Search, SlidersHorizontal, Sun } from 'lucide-react';
import { enginePageStrings } from '../i18n/enginePage';
import { View } from '../types';
import { useI18n } from '../context/I18nContext';
import { setupLabel } from '../services/modelCatalog';
import { ResourceMonitor } from './ResourceMonitor';
import { PlayerExtraButtons } from './player/PlayerExtraButtons';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  user?: { username: string; isAdmin?: boolean; avatar_url?: string } | null;
  onOpenSettings?: () => void;
  onOpenEngines?: () => void;
  isOpen?: boolean;
  onToggle?: () => void;
  /** The journal: whether it is open. */
  journalOpen?: boolean;
  onToggleJournal?: () => void;
}

type NativeSetupStatus = {
  ready: boolean;
  engine_ready: boolean;
  engine_id: string;
  selected_profile_id?: string | null;
  selected_component_ids?: string[] | null;
  own_model?: string | null;
  own_model_name?: Record<string, string> | null;
};

const StatusLine: React.FC<{ active: boolean; pending?: boolean; label: string; hint?: string }> = ({ active, pending, label, hint }) => (
  <div className="flex min-w-0 items-center gap-1.5 text-zinc-500 dark:text-zinc-400" title={hint ?? label}>
    <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${active ? 'bg-emerald-500' : pending ? 'animate-pulse bg-amber-400' : 'bg-zinc-400 dark:bg-zinc-600'}`} />
    <span className="truncate">{label}</span>
  </div>
);

const SystemWidget: React.FC<{ isOpen?: boolean }> = ({ isOpen }) => {
  const { t, language } = useI18n();
  const tt = t as unknown as (key: string) => string;
  const setupQuery = useSetupStatus<NativeSetupStatus>();
  const setup = setupQuery.isError ? null : setupQuery.data ?? null;
  const unreachable = setupQuery.isError;
  const openRouter = useOpenRouterSettings<{ configured?: boolean }>().data ?? null;

  // The credential lives in the native server, never in browser storage, so
  // the badge asks the server whether one is configured.
  const openRouterConfigured = openRouter?.configured === true;
  const engineReady = setup?.engine_ready === true;
  const modelReady = setup?.ready === true;
  const profile = setupLabel(t, language, setup);
  // Without a model set on disk the engine is not starting, it is waiting.
  // a card is there, but the engine went down its devices to the processor: ready, and many times slower
  const onProcessor = engineReady && (setup as { engine_on_processor?: boolean } | null)?.engine_on_processor === true;
  const engineLabel = unreachable ? t('engineUnavailable') : onProcessor ? t('engineOnProcessor') : engineReady ? t('engineReachable') : modelReady ? t('engineStarting') : tt('engineWaitsForModels');
  const modelLabel = modelReady ? `${t('profileReady')}: ${profile}` : t('profileNotInstalled');

  if (!isOpen) {
    return (
      <div className="flex w-full justify-center py-2" title={onProcessor ? `${engineLabel}. ${t('engineOnProcessorHint')}` : `${engineLabel} · ${modelLabel}`}>
        <span className={`h-2 w-2 rounded-full ${onProcessor ? 'bg-amber-400' : engineReady && modelReady ? 'bg-emerald-500' : unreachable ? 'bg-rose-500' : 'animate-pulse bg-amber-400'}`} />
      </div>
    );
  }

  // With nobody answering, the model and provider lines would be guesses. Say
  // the one thing that is actually known: the service is not responding.
  if (unreachable) {
    return (
      <div className="space-y-1.5 rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px]">
        <StatusLine active={false} label={t('serviceUnavailable')} />
      </div>
    );
  }

  return (
    <div className="space-y-1.5 rounded-xl border border-zinc-200/70 bg-zinc-50/80 px-3 py-2 text-[10px] dark:border-white/5 dark:bg-zinc-900/50">
      <StatusLine active={engineReady && modelReady && !onProcessor} pending={onProcessor || (!unreachable && !(engineReady && modelReady))} label={engineLabel} hint={onProcessor ? t('engineOnProcessorHint') : undefined} />
      <StatusLine active={modelReady} pending={!unreachable && !modelReady} label={modelLabel} />
      <StatusLine active={openRouterConfigured} label={openRouterConfigured ? t('openRouterConfigured') : t('openRouterNotConfigured')} />
    </div>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  theme,
  onToggleTheme,
  user,
  onOpenSettings,
  onOpenEngines,
  isOpen = true,
  onToggle,
  journalOpen = false,
  onToggleJournal,
}) => {
  const { t, language } = useI18n();
  const portable = useSetupStatus<{ portable?: boolean }>().data?.portable;

  return (
    <>
      {isOpen && onToggle && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-xs md:hidden" onClick={onToggle} />
      )}

      <aside className={`fixed inset-y-0 left-0 z-50 flex h-full min-h-0 shrink-0 flex-col overflow-hidden border-r border-zinc-200 bg-white py-4 transition-[width,transform] duration-300 dark:border-white/5 dark:bg-suno-sidebar md:relative md:inset-auto ${isOpen ? 'w-[min(20rem,calc(var(--vw)*100-2.5rem))] md:w-[200px]' : 'w-[72px]'}`}>
        <div className="mb-6 flex min-w-0 items-center justify-between gap-2 px-3">
          <div className="flex min-w-0 items-center gap-3">
            {/* The studio mark: the application icon. */}
            <button type="button" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] shadow-lg transition-transform hover:scale-105" onClick={() => onNavigate('create')} title="WMK Music Studio">
              {/* The application's own icon, so the window and the taskbar
                  show the same mark. */}
              <img src="data:image/jpeg;base64,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" alt="WMK Music Studio" className="h-10 w-10 rounded-[11px] object-contain" />
            </button>
            {isOpen && (
              <span className="flex min-w-0 flex-col" title="WMK Music Studio">
                <span className="text-[13px] font-bold leading-[1.15] text-zinc-900 dark:text-white">WMK Music Studio</span><span className="text-[9px] text-zinc-500" title="Walney Moreira Klein — walneyk@hotmail.com">Walney Moreira Klein</span>
                <span className="flex flex-wrap gap-x-1.5 text-[10px] font-medium leading-4 text-zinc-500 dark:text-zinc-400"><span>v{__APP_VERSION__}</span>{portable && <span>{t('portableEdition')}</span>}</span>
              </span>
            )}
          </div>
          {onToggle && (
            <button type="button" onClick={onToggle} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/10 dark:hover:text-white" title={isOpen ? t('collapseSidebar') : t('expandSidebar')}>
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />}
              </svg>
            </button>
          )}
        </div>

        <nav className="flex min-h-0 w-full flex-1 flex-col gap-2 overflow-y-auto px-3 scrollbar-hide">
          <NavItem icon={<Disc size={20} />} label={t('create')} active={currentView === 'create'} onClick={() => onNavigate('create')} isExpanded={isOpen} />
          <NavItem icon={<Library size={20} />} label={t('library')} active={currentView === 'library'} onClick={() => onNavigate('library')} isExpanded={isOpen} />
          <NavItem icon={<Search size={20} />} label={t('search')} active={currentView === 'search'} onClick={() => onNavigate('search')} isExpanded={isOpen} />
          <NavItem icon={<Layers size={20} />} label={t('adaptersNav')} active={currentView === 'adapters'} onClick={() => onNavigate('adapters')} isExpanded={isOpen} />
          <NavItem icon={<SlidersHorizontal size={20} />} label={t('studioTools')} active={currentView === 'tools'} onClick={() => onNavigate('tools')} isExpanded={isOpen} />
          {onOpenEngines && <NavItem icon={<Cpu size={20} />} label={enginePageStrings[language][0]} active={false} onClick={onOpenEngines} isExpanded={isOpen} />}
          <NavItem icon={<Newspaper size={20} />} label={t('news')} active={currentView === 'news'} onClick={() => onNavigate('news')} isExpanded={isOpen} />
          {onToggleJournal && <NavItem icon={<ScrollText size={20} />} label={t('journal')} active={journalOpen} opens={journalOpen} onClick={onToggleJournal} isExpanded={isOpen} />}

          <div className="mt-auto flex flex-col gap-2">
            {/* the files panel docks its chip here */}
            <div id="dock-slot" className="flex flex-col" />
            {/* the player's extras, also when no song is loaded and the player bar is away */}
            <div className={isOpen ? 'flex flex-col gap-1' : 'flex flex-col gap-2'}>
              <PlayerExtraButtons layout={isOpen ? 'list' : 'rail'} />
            </div>
            <ResourceMonitor isOpen={isOpen} />
            <SystemWidget isOpen={isOpen} />
            <button type="button" onClick={onToggleTheme} className={`flex w-full items-center gap-3 rounded-xl text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white ${isOpen ? 'justify-start px-3 py-2.5' : 'aspect-square justify-center'}`} title={theme === 'dark' ? t('lightMode') : t('darkMode')}>
              <span className="shrink-0">{theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}</span>
              {isOpen && <span className="truncate text-sm font-medium">{theme === 'dark' ? t('lightMode') : t('darkMode')}</span>}
            </button>

              <button type="button" onClick={onOpenSettings} className={`flex w-full items-center gap-3 rounded-xl text-zinc-500 transition-all duration-200 hover:bg-zinc-100 hover:text-black dark:text-zinc-400 dark:hover:bg-white/5 dark:hover:text-white ${isOpen ? 'justify-start px-3 py-2.5' : 'aspect-square justify-center'}`} title={`${user.username} - ${t('settings')}`}>
                <span className="flex h-6 w-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/20 bg-linear-to-br from-pink-500 to-purple-600 text-xs font-bold text-white">{user.username.charAt(0).toUpperCase()}</span>
                {isOpen && <span className="min-w-0 flex-1 truncate text-left text-sm font-medium">{user.username}</span>}
              </button>
          </div>
        </nav>
      </aside>
    </>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  onClick: () => void;
  isExpanded?: boolean;
  /** For an item that opens a panel rather than a page: whether it is open. */
  opens?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, active, onClick, isExpanded, opens }) => (
  <button type="button" onClick={onClick} aria-expanded={opens} className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl transition-all duration-200 ${isExpanded ? 'justify-start px-3 py-2.5' : 'aspect-square justify-center'} ${active ? 'bg-zinc-100 text-black dark:bg-white/10 dark:text-white' : 'text-zinc-500 hover:bg-zinc-100 hover:text-black dark:hover:bg-white/5 dark:hover:text-white'}`} title={label}>
    {active && <span className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-pink-500" />}
    <span className="shrink-0">{icon}</span>
    {isExpanded && <span className="truncate text-sm font-medium">{label}</span>}
  </button>
);
