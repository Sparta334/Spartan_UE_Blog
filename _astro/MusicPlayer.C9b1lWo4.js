import"./disclose-version.DwdwGuwu.js";import{B as y,D as k,F as D,H as Te,J as G,K as ae,L as Me,M as L,N as Ee,O as ee,P as n,Q as a,R as o,S as Le,T as X,U as le,V as De,W as ce,X as ze,Y as $,Z as Ie,_ as Ve,b as fe,c as R,d as B,et as Re,f as He,g as Be,j as Y,k as S,m as ye,p as qe,q as re,r as Fe,t as Q,u as be,v as H,y as he,z as Z}from"./client.JNghZhR3.js";import{t as I}from"./Icon.C19tT9us.js";import{n as W,t as J}from"./translation.CrSpPOk_.js";import{n as oe}from"./config.BiS2ipB6.js";import{n as Ae,t as p}from"./musicPlayerStore.DfGZW1sc.js";import{a as se,c as Ke,i as Ne,l as Xe,n as je,o as Ue,r as Ye,s as Oe,t as We}from"./SidebarTrackInfo.CTCcZuYE.js";ze();function Je(u){const e=u-1;return e*e*e+1}function xe(u){const e=u-1;return e*e*e+1}function de(u){const e=typeof u=="string"&&u.match(/^\s*(-?[\d.]+)([^\s]*)\s*$/);return e?[parseFloat(e[1]),e[2]||"px"]:[u,"px"]}function Qe(u,{delay:e=0,duration:t=400,easing:l=xe,x:s=0,y:r=0,opacity:b=0}={}){const d=getComputedStyle(u),P=+d.opacity,i=d.transform==="none"?"":d.transform,c=P*(1-b),[g,m]=de(s),[C,x]=de(r);return{delay:e,duration:t,easing:l,css:(v,_)=>`
			transform: ${i} translate(${(1-v)*g}${m}, ${(1-v)*C}${x});
			opacity: ${P-c*_}`}}function Ze(u,{delay:e=0,duration:t=400,easing:l=xe,axis:s="y"}={}){const r=getComputedStyle(u),b=+r.opacity,d=s==="y"?"height":"width",P=parseFloat(r[d]),i=s==="y"?["top","bottom"]:["left","right"],c=i.map(w=>`${w[0].toUpperCase()}${w.slice(1)}`),g=parseFloat(r[`padding${c[0]}`]),m=parseFloat(r[`padding${c[1]}`]),C=parseFloat(r[`margin${c[0]}`]),x=parseFloat(r[`margin${c[1]}`]),v=parseFloat(r[`border${c[0]}Width`]),_=parseFloat(r[`border${c[1]}Width`]);return{delay:e,duration:t,easing:l,css:w=>`overflow: hidden;opacity: ${Math.min(w*20,1)*b};${d}: ${w*P}px;padding-${i[0]}: ${w*g}px;padding-${i[1]}: ${w*m}px;margin-${i[0]}: ${w*C}px;margin-${i[1]}: ${w*x}px;border-${i[0]}-width: ${w*v}px;border-${i[1]}-width: ${w*_}px;min-${d}: 0`}}var Ge=S('<div class="fab-music-panel card-base shadow-xl rounded-2xl p-4 w-[20rem] max-w-[80vw] svelte-1lty5dg"><div class="fab-music-header svelte-1lty5dg"><!> <!></div> <!> <!> <!></div>');function $e(u,e){$(e,!0);let t=ce(De(p.getState())),l=ce(!1);function s(f){const E=f;E.detail&&le(t,E.detail,!0)}fe(()=>{window.addEventListener("music-sidebar:state",s)}),he(()=>{typeof window<"u"&&window.removeEventListener("music-sidebar:state",s)});function r(){p.toggle()}function b(){p.prev()}function d(){p.next()}function P(){p.toggleMode()}function i(){le(l,!n(l))}function c(f){p.playIndex(f)}function g(f){p.seek(f)}function m(){p.toggleMute()}function C(f){p.setVolume(f)}var x=Ge(),v=o(x),_=o(v);Ne(_,{get currentSong(){return n(t).currentSong},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading}}),We(y(_,2),{get currentSong(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},onToggleMute:m,onSetVolume:C}),a(v);var w=y(v,2);je(w,{get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},onSeek:g});var z=y(w,2);Ue(z,{get isPlaying(){return n(t).isPlaying},get isShuffled(){return n(t).isShuffled},get repeatMode(){return n(t).isRepeating},onToggleMode:P,onPrev:b,onNext:d,onTogglePlay:r,onTogglePlaylist:i}),Ye(y(z,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(l)},onClose:i,onPlaySong:c}),a(x),k(u,x),G()}var et=S('<div class="flex-1 min-w-0"><div class="text-sm font-medium text-90 truncate"> </div> <div class="text-xs text-50 truncate"> </div></div>'),tt=S('<div class="text-xs text-30 mt-1"> </div>'),nt=S('<div class="flex-1 min-w-0"><div class="song-title text-lg font-bold text-90 truncate mb-1"> </div> <div class="song-artist text-sm text-50 truncate"> </div> <!></div>');function ge(u,e){$(e,!0);const t=Q(e,"showTime",3,!1),l=Q(e,"size",3,"mini");function s(i){return!Number.isFinite(i)||i<0?"0:00":`${Math.floor(i/60)}:${Math.floor(i%60).toString().padStart(2,"0")}`}var r=ee(),b=Z(r),d=i=>{var c=et(),g=o(c),m=o(g,!0);a(g);var C=y(g,2),x=o(C,!0);a(C),a(c),D(()=>{X(m,e.song.title),X(x,e.song.artist)}),k(i,c)},P=i=>{var c=nt(),g=o(c),m=o(g,!0);a(g);var C=y(g,2),x=o(C,!0);a(C);var v=y(C,2),_=w=>{var z=tt(),f=o(z);a(z),D((E,j)=>X(f,`${E??""} / ${j??""}`),[()=>s(e.currentTime),()=>s(e.duration)]),k(w,z)};H(v,w=>{t()&&w(_)}),a(c),D(()=>{X(m,e.song.title),X(x,e.song.artist)}),k(i,c)};H(b,i=>{l()==="mini"?i(d):i(P,-1)}),k(u,r),G()}var it=S('<!> <div class="flex-1 min-w-0 cursor-pointer" role="button" tabindex="0"><!></div> <div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button></div>',1),rt=S('<div class="flex items-center gap-1"><button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button> <button><!></button></div>'),at=S("<!> <!> <!>",1),ot=S("<div><!></div>");function we(u,e){$(e,!0);const t=Q(e,"size",3,"mini"),l=Q(e,"showControls",3,!1),s=Q(e,"showPlaylist",3,!1);var r=ot(),b=o(r),d=i=>{var c=it(),g=Z(c);se(g,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",interactive:!0,get onclick(){return e.onCoverClick}});var m=y(g,2);ge(o(m),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},size:"mini"}),a(m);var C=y(m,2),x=o(C);I(o(x),{icon:"material-symbols:visibility-off",class:"text-lg"}),a(x);var v=y(x,2);I(o(v),{icon:"material-symbols:expand-less",class:"text-lg"}),a(v),a(C),D((_,w)=>{R(m,"aria-label",_),R(x,"title",w)},[()=>J(W.musicPlayerExpand),()=>J(W.musicPlayerHide)]),L("click",m,function(..._){e.onInfoClick?.apply(this,_)}),L("keydown",m,_=>{(_.key==="Enter"||_.key===" ")&&(_.preventDefault(),e.onInfoClick?.())}),L("click",x,_=>{_.stopPropagation(),e.onHideClick?.()}),L("click",v,_=>{_.stopPropagation(),e.onExpandClick?.()}),k(i,c)},P=i=>{var c=at(),g=Z(c);se(g,{get cover(){return e.song.cover},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded"});var m=y(g,2);ge(m,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},showTime:!0,size:"expanded"});var C=y(m,2),x=v=>{var _=rt(),w=o(_);I(o(w),{icon:"material-symbols:visibility-off",class:"text-lg"}),a(w);var z=y(w,2);let f;I(o(z),{icon:"material-symbols:queue-music",class:"text-lg"}),a(z),a(_),D((E,j)=>{R(w,"title",E),f=B(z,1,"btn-plain w-8 h-8 rounded-lg flex items-center justify-center",null,f,{"text-[var(--primary)]":s()}),R(z,"title",j)},[()=>J(W.musicPlayerHide),()=>J(W.musicPlayerPlaylist)]),L("click",w,function(...E){e.onHideClick?.apply(this,E)}),L("click",z,function(...E){e.onPlaylistClick?.apply(this,E)}),k(v,_)};H(C,v=>{l()&&v(x)}),k(i,c)};H(b,i=>{t()==="mini"?i(d):i(P,-1)}),a(r),D(()=>B(r,1,He(t()==="mini"?"flex items-center gap-3 mb-0":"flex items-center gap-4 mb-4"))),k(u,r),G()}Y(["click","keydown"]);var lt=S("<div><!></div>");function st(u,e){var t=lt();let l;we(o(t),{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"mini",get onCoverClick(){return e.onCoverClick},get onInfoClick(){return e.onInfoClick},get onHideClick(){return e.onHideClick},get onExpandClick(){return e.onExpandClick}}),a(t),D(()=>l=B(t,1,"mini-player card-base shadow-xl rounded-2xl p-3 absolute bottom-0 right-0 w-70 svelte-g9ac72",null,l,{"mini-enter":!e.isHidden,"mini-leave":e.isHidden,"pointer-events-none":e.isHidden})),k(u,t)}var me=S("<button><!></button>");function ve(u,e){const t=Q(e,"repeatMode",3,0),l=Q(e,"disabled",3,!1);var s=ee(),r=Z(s),b=P=>{var i=me();let c;I(o(i),{icon:"material-symbols:shuffle",class:"text-lg"}),a(i),D(()=>{c=B(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive}),i.disabled=l()}),L("click",i,function(...g){e.onclick?.apply(this,g)}),k(P,i)},d=P=>{var i=me();let c;var g=o(i),m=v=>{I(v,{icon:"material-symbols:repeat-one",class:"text-lg"})},C=v=>{I(v,{icon:"material-symbols:repeat",class:"text-lg"})},x=v=>{I(v,{icon:"material-symbols:repeat",class:"text-lg opacity-50"})};H(g,v=>{t()===1?v(m):t()===2?v(C,1):v(x,-1)}),a(i),D(()=>c=B(i,1,"w-10 h-10 rounded-lg",null,c,{"btn-regular":e.isActive,"btn-plain":!e.isActive})),L("click",i,function(...v){e.onclick?.apply(this,v)}),k(P,i)};H(r,P=>{e.mode==="shuffle"?P(b):P(d,-1)}),k(u,s)}Y(["click"]);var ut=S('<div class="controls flex items-center justify-center gap-2 mb-4"><!> <!> <!> <!> <!></div>');function ct(u,e){var t=ut(),l=o(t);ve(l,{mode:"shuffle",get isActive(){return e.isShuffled},get onclick(){return e.onShuffleClick}});var s=y(l,2);Oe(s,{get onclick(){return e.onPrevClick},disabled:!1});var r=y(s,2);Ke(r,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get onclick(){return e.onPlayClick}});var b=y(r,2);Xe(b,{get onclick(){return e.onNextClick},disabled:!1});var d=y(b,2);{let P=re(()=>e.isRepeating>0);ve(d,{mode:"repeat",get isActive(){return n(P)},get repeatMode(){return e.isRepeating},get onclick(){return e.onRepeatClick}})}a(t),k(u,t)}var dt=S('<div class="progress-bar flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div class="h-full bg-(--primary) rounded-full transition-all duration-100"></div></div>');function gt(u,e){$(e,!0);var t=dt(),l=o(t);a(t),D(s=>{R(t,"aria-label",s),R(t,"aria-valuenow",e.duration>0?e.currentTime/e.duration*100:0),be(l,`width: ${e.duration>0?e.currentTime/e.duration*100:0}%`)},[()=>J(W.musicPlayerProgress)]),L("click",t,function(...s){e.onclick?.apply(this,s)}),L("keydown",t,function(...s){e.onkeydown?.apply(this,s)}),k(u,t),G()}Y(["click","keydown"]);var mt=S('<div class="progress-section mb-4"><!></div>');function vt(u,e){var t=mt();gt(o(t),{get currentTime(){return e.currentTime},get duration(){return e.duration},get onclick(){return e.onProgressClick},get onkeydown(){return e.onProgressKeyDown}}),a(t),k(u,t)}var ft=S('<button class="btn-plain w-8 h-8 rounded-lg"><!></button>');function yt(u,e){var t=ft(),l=o(t),s=d=>{I(d,{icon:"material-symbols:volume-off",class:"text-lg"})},r=d=>{I(d,{icon:"material-symbols:volume-down",class:"text-lg"})},b=d=>{I(d,{icon:"material-symbols:volume-up",class:"text-lg"})};H(l,d=>{e.isMuted||e.volume===0?d(s):e.volume<.5?d(r,1):d(b,-1)}),a(t),L("click",t,function(...d){e.onclick?.apply(this,d)}),k(u,t)}Y(["click"]);var bt=S('<div class="flex-1 h-2 bg-(--btn-regular-bg) rounded-full cursor-pointer touch-none" role="slider" tabindex="0" aria-valuemin="0" aria-valuemax="100"><div></div></div>');function ht(u,e){var t=bt(),l=o(t);let s;a(t),qe(t,r=>e.volumeBarRef?.(r)),D(()=>{R(t,"aria-label",e.ariaLabel),R(t,"aria-valuenow",e.volume*100),s=B(l,1,"h-full bg-(--primary) rounded-full transition-all",null,s,{"duration-100":!e.isVolumeDragging,"duration-0":e.isVolumeDragging}),be(l,`width: ${e.volume*100}%`)}),L("pointerdown",t,function(...r){e.onpointerdown?.apply(this,r)}),L("keydown",t,function(...r){e.onkeydown?.apply(this,r)}),k(u,t)}Y(["pointerdown","keydown"]);var xt=S('<div class="bottom-controls flex items-center gap-2"><!> <!> <!></div>');function wt(u,e){var t=xt(),l=o(t);yt(l,{get volume(){return e.volume},get isMuted(){return e.isMuted},get onclick(){return e.onVolumeButtonClick}});var s=y(l,2);{let b=re(()=>e.isMuted?0:e.volume);ht(s,{get volume(){return n(b)},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onpointerdown(){return e.onSliderPointerDown},get onkeydown(){return e.onSliderKeyDown},get ariaLabel(){return e.ariaLabel}})}var r=y(s,2);Le(r,()=>e.children??Re),a(t),k(u,t)}var pt=S('<button class="btn-plain w-8 h-8 rounded-lg flex items-center justify-center"><!></button>'),kt=S("<div><!> <!> <!> <!></div>");function _t(u,e){$(e,!0);var t=kt();let l;var s=o(t);we(s,{get song(){return e.song},get currentTime(){return e.currentTime},get duration(){return e.duration},get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},size:"expanded",showControls:!0,get showPlaylist(){return e.showPlaylist},get onHideClick(){return e.onHideClick},get onPlaylistClick(){return e.onPlaylistClick}});var r=y(s,2);vt(r,{get currentTime(){return e.currentTime},get duration(){return e.duration},get onProgressClick(){return e.onProgressClick},get onProgressKeyDown(){return e.onProgressKeyDown}});var b=y(r,2);ct(b,{get isPlaying(){return e.isPlaying},get isLoading(){return e.isLoading},get isShuffled(){return e.isShuffled},get isRepeating(){return e.isRepeating},get canSkip(){return e.canSkip},get onPlayClick(){return e.onPlayClick},get onPrevClick(){return e.onPrevClick},get onNextClick(){return e.onNextClick},get onShuffleClick(){return e.onShuffleClick},get onRepeatClick(){return e.onRepeatClick}});var d=y(b,2);{let P=re(()=>J(W.musicPlayerVolume));wt(d,{get volume(){return e.volume},get isMuted(){return e.isMuted},get isVolumeDragging(){return e.isVolumeDragging},get volumeBarRef(){return e.volumeBarRef},get onVolumeButtonClick(){return e.onVolumeButtonClick},get onSliderPointerDown(){return e.onSliderPointerDown},get onSliderKeyDown(){return e.onSliderKeyDown},get ariaLabel(){return n(P)},children:(i,c)=>{var g=pt();I(o(g),{icon:"material-symbols:expand-more",class:"text-lg"}),a(g),D(m=>R(g,"title",m),[()=>J(W.musicPlayerCollapse)]),L("click",g,function(...m){e.onCollapseClick?.apply(this,m)}),k(i,g)},$$slots:{default:!0}})}a(t),D(()=>l=B(t,1,"expanded-player card-base shadow-xl rounded-2xl p-4 transition-all duration-500 ease-in-out absolute bottom-0 right-0 w-80",null,l,{"opacity-0":e.isHidden,"scale-95":e.isHidden,"pointer-events-none":e.isHidden})),k(u,t),G()}Y(["click"]);var Pt=S('<span class="text-sm text-[var(--content-meta)]"> </span>'),Ct=S('<div role="button" tabindex="0"><div class="w-6 h-6 flex items-center justify-center"><!></div> <div class="w-10 h-10 rounded-lg overflow-hidden bg-[var(--btn-regular-bg)] flex-shrink-0"><img decoding="async" class="w-full h-full object-cover"/></div> <div class="flex-1 min-w-0"><div> </div> <div> </div></div></div>');function St(u,e){$(e,!0);const t=Q(e,"lazy",3,!0);var l=Ct();let s;var r=o(l),b=o(r),d=f=>{I(f,{icon:"material-symbols:graphic-eq",class:"text-[var(--primary)] animate-pulse"})},P=f=>{I(f,{icon:"material-symbols:pause",class:"text-[var(--primary)]"})},i=f=>{var E=Pt(),j=o(E,!0);a(E),D(()=>X(j,e.index+1)),k(f,E)};H(b,f=>{e.isCurrent&&e.isPlaying?f(d):e.isCurrent?f(P,1):f(i,-1)}),a(r);var c=y(r,2),g=o(c);a(c);var m=y(c,2),C=o(m);let x;var v=o(C,!0);a(C);var _=y(C,2);let w;var z=o(_,!0);a(_),a(m),a(l),D(f=>{s=B(l,1,"playlist-item flex items-center gap-3 p-3 hover:bg-[var(--btn-plain-bg-hover)] cursor-pointer transition-colors",null,s,{"bg-[var(--btn-plain-bg)]":e.isCurrent,"text-[var(--primary)]":e.isCurrent}),R(l,"aria-label",`播放 ${e.song.title??""} - ${e.song.artist??""}`),R(g,"src",f),R(g,"alt",e.song.title),R(g,"loading",t()?"lazy":"eager"),x=B(C,1,"font-medium truncate",null,x,{"text-[var(--primary)]":e.isCurrent,"text-90":!e.isCurrent}),X(v,e.song.title),w=B(_,1,"text-sm text-[var(--content-meta)] truncate",null,w,{"text-[var(--primary)]":e.isCurrent}),X(z,e.song.artist)},[()=>Ae(e.song.cover||"/favicon/favicon.ico")]),L("click",l,function(...f){e.onclick?.apply(this,f)}),L("keydown",l,f=>{(f.key==="Enter"||f.key===" ")&&(f.preventDefault(),e.onclick())}),k(u,l),G()}Y(["click","keydown"]);var Tt=S('<div class="playlist-panel card-base-transparent fixed bottom-70 right-4 w-80 max-h-96 overflow-hidden z-50 svelte-1v267om"><div class="playlist-header flex items-center justify-between p-4 border-b border-(--line-divider)"><h3 class="text-lg font-semibold text-90"> </h3> <button class="btn-plain w-8 h-8 rounded-lg"><!></button></div> <div class="playlist-content overflow-y-auto max-h-80 hide-scrollbar" role="presentation"></div></div>');function Mt(u,e){$(e,!0);var t=ee(),l=Z(t),s=r=>{var b=Tt(),d=o(b),P=o(d),i=o(P,!0);a(P);var c=y(P,2);I(o(c),{icon:"material-symbols:close",class:"text-lg"}),a(c),a(d);var g=y(d,2);Be(g,21,()=>e.playlist,Ve,(m,C,x)=>{{let v=re(()=>x===e.currentIndex);St(m,{get song(){return n(C)},index:x,get isCurrent(){return n(v)},get isPlaying(){return e.isPlaying},onclick:()=>e.onPlaySong(x),lazy:x!==0})}}),a(g),a(b),D(m=>X(i,m),[()=>J(W.musicPlayerPlaylist)]),L("click",c,function(...m){e.onClose?.apply(this,m)}),ye(3,b,()=>Ze,()=>({duration:300,axis:"y"})),k(r,b)};H(l,r=>{e.show&&r(s)}),k(u,t),G()}Y(["click"]);var Et=S('<div class="fixed bottom-20 right-4 z-60 max-w-sm"><div class="bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 animate-slide-up"><!> <span class="text-sm flex-1"> </span> <button class="text-white/80 hover:text-white transition-colors"><!></button></div></div>'),Lt=S('<div class="music-player-fab-anchor fixed z-55"><div class="music-player-fab-shell"><!></div></div>'),Dt=S("<div><div><!></div> <!> <!> <!></div>"),zt=S(`<!> <!> <style>.music-player-fab-anchor {
			right: var(--fab-group-right, 1.5rem);
			bottom: calc(
				var(--fab-group-bottom, 10rem) +
					(
						var(--fab-button-size, 3rem) *
							var(--fab-visible-count, 1)
					) +
					(
						var(--fab-group-gap, 0.5rem) *
							(var(--fab-visible-count, 1) - 1)
					)
			);
			width: 0;
			height: 0;
			pointer-events: none;
		}

		.music-player-fab-shell {
			position: absolute;
			right: 0;
			bottom: 0.75rem;
			transform-origin: bottom right;
			pointer-events: auto;
			will-change: transform, opacity;
		}

		.orb-player-container {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		.orb-enter {
			animation: orbElasticIn 460ms cubic-bezier(0.22, 1.25, 0.36, 1)
				forwards;
		}

		.orb-leave {
			animation: orbElasticOut 360ms cubic-bezier(0.4, 0, 1, 1) forwards;
		}

		@keyframes orbElasticIn {
			0% {
				opacity: 0;
				transform: translateX(0) scale(0.55);
			}
			70% {
				opacity: 1;
				transform: translateX(0) scale(1.12);
			}
			100% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
		}

		@keyframes orbElasticOut {
			0% {
				opacity: 1;
				transform: translateX(0) scale(1);
			}
			100% {
				opacity: 0;
				transform: translateX(0) scale(0.6);
			}
		}

		.music-player.hidden-mode {
			width: 3rem;
			height: 3rem;
		}

		.music-player {
			width: 20rem;
			max-width: 20rem;
			min-width: 20rem;
			user-select: none;
		}

		:global(.mini-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.expanded-player) {
			position: absolute;
			bottom: 0;
			right: 0;
		}

		:global(.orb-player) {
			position: relative;
			backdrop-filter: blur(10px);
			-webkit-backdrop-filter: blur(10px);
		}

		:global(.orb-player::before) {
			content: "";
			position: absolute;
			inset: -0.125rem;
			background: linear-gradient(
				45deg,
				var(--primary),
				transparent,
				var(--primary)
			);
			border-radius: 50%;
			z-index: -1;
			opacity: 0;
			transition: opacity 0.3s ease;
		}

		:global(.orb-player:hover::before) {
			opacity: 0.3;
			animation: rotate 2s linear infinite;
		}

		:global(.orb-player .animate-pulse) {
			animation: musicWave 1.5s ease-in-out infinite;
		}

		@keyframes rotate {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		@keyframes musicWave {
			0%,
			100% {
				transform: scaleY(0.5);
			}
			50% {
				transform: scaleY(1);
			}
		}

		:global(.animate-pulse) {
			animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
		}

		@keyframes pulse {
			0%,
			100% {
				opacity: 1;
			}
			50% {
				opacity: 0.5;
			}
		}

		:global(.progress-section div:hover),
		:global(.bottom-controls > div:hover) {
			transform: scaleY(1.2);
			transition: transform 0.2s ease;
		}

		@media (width < 768px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.75rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 5rem) +
						(
							var(--fab-button-size, 2.75rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				bottom: 0.5rem !important;
				right: 0.5rem !important;
			}
			:global(.mini-player) {
				width: 280px !important;
			}
			:global(.expanded-player) {
				width: 280px !important;
				max-width: 280px !important;
			}
			.music-player.expanded {
				width: 280px !important;
				min-width: 280px !important;
				max-width: 280px !important;
				right: 0.5rem !important;
			}
			:global(.playlist-panel) {
				width: 280px !important;
				right: 0.5rem !important;
				max-width: 280px !important;
			}
			:global(.controls) {
				gap: 8px;
			}
			:global(.controls button) {
				width: 36px;
				height: 36px;
			}
			:global(.controls button:nth-child(3)) {
				width: 44px;
				height: 44px;
			}
		}

		@media (width < 480px) {
			.music-player-fab-anchor {
				right: var(--fab-group-right, 0.5rem) !important;
				bottom: calc(
					var(--fab-group-bottom, 4.5rem) +
						(
							var(--fab-button-size, 2.5rem) *
								var(--fab-visible-count, 1)
						) +
						(
							var(--fab-group-gap, 0.5rem) *
								(var(--fab-visible-count, 1) - 1)
						)
				) !important;
			}

			.music-player-fab-shell {
				right: 0 !important;
				bottom: 0.75rem !important;
			}

			.music-player {
				width: 260px !important;
				min-width: 260px !important;
				max-width: 260px !important;
			}
			:global(.expanded-player) {
				width: 260px !important;
				max-width: 260px !important;
			}
			:global(.playlist-panel) {
				width: 260px !important;
				max-width: 260px !important;
				right: 0.5rem !important;
			}
			:global(.song-title) {
				font-size: 14px;
			}
			:global(.song-artist) {
				font-size: 12px;
			}
			:global(.controls) {
				gap: 6px;
				margin-bottom: 12px;
			}
			:global(.controls button) {
				width: 32px;
				height: 32px;
			}
			:global(.controls button:nth-child(3)) {
				width: 40px;
				height: 40px;
			}
			:global(.playlist-item) {
				padding: 8px 12px;
			}
			:global(.playlist-item .w-10) {
				width: 32px;
				height: 32px;
			}
		}

		@keyframes slide-up {
			from {
				transform: translateY(100%);
				opacity: 0;
			}
			to {
				transform: translateY(0);
				opacity: 1;
			}
		}

		.animate-slide-up {
			animation: slide-up 0.3s ease-out;
		}

		@media (hover: none) and (pointer: coarse) {
			:global(.music-player button),
			:global(.playlist-item) {
				min-height: 44px;
			}
			:global(.progress-section > div),
			:global(.bottom-controls > div:nth-child(2)) {
				height: 12px;
			}
		}

		@keyframes spin-continuous {
			from {
				transform: rotate(0deg);
			}
			to {
				transform: rotate(360deg);
			}
		}

		:global(.cover-container img) {
			animation: spin-continuous 3s linear infinite;
			animation-play-state: paused;
		}

		:global(.cover-container img.spinning) {
			animation-play-state: running;
		}

		:global(button.bg-\\\\[var\\\\(--primary\\\\)\\\\]) {
			box-shadow: 0 0 0 2px var(--primary);
			border: none;
		}</style>`,1);function Nt(u,e){$(e,!1);let t=Te(p.getState());const l=oe.showFloatingPlayer,s=(oe.floatingEntryMode??"default")==="fab",r=l&&oe.enable;let b;function d(){p.toggle()}function P(){p.prev()}function i(){p.next()}function c(){p.toggleShuffle()}function g(){p.toggleRepeat()}function m(h){p.playIndex(h)}function C(h){const T=h.currentTarget;if(!T)return;const U=T.getBoundingClientRect(),K=(h.clientX-U.left)/U.width;p.setProgress(K)}function x(h){(h.key==="Enter"||h.key===" ")&&(h.preventDefault(),p.setProgress(.5))}function v(){p.toggleMute()}function _(){p.toggleMute()}function w(h){const T=h.currentTarget;if(!T)return;const U=M=>{const q=T.getBoundingClientRect();if(q.width<=0)return;const F=Math.max(0,Math.min(1,(M-q.left)/q.width));p.setVolume(F)};U(h.clientX);const K=h.pointerId;T.setPointerCapture(K);const te=M=>{M.pointerId===K&&U(M.clientX)},ne=()=>{T.removeEventListener("pointermove",te),T.removeEventListener("pointerup",ie),T.removeEventListener("pointercancel",V),T.hasPointerCapture(K)&&T.releasePointerCapture(K)},ie=M=>{M.pointerId===K&&(U(M.clientX),ne())},V=M=>{M.pointerId===K&&ne()};T.addEventListener("pointermove",te),T.addEventListener("pointerup",ie),T.addEventListener("pointercancel",V)}function z(h){const T=h.target;if(!(T?.tagName==="INPUT"||T?.tagName==="TEXTAREA"||T?.contentEditable==="true")){if(h.key==="ArrowLeft"||h.key==="ArrowDown"){h.preventDefault(),p.setVolume(n(t).volume-.05);return}if(h.key==="ArrowRight"||h.key==="ArrowUp"){h.preventDefault(),p.setVolume(n(t).volume+.05);return}(h.key==="Enter"||h.key===" "||h.key==="m"||h.key==="M")&&(h.preventDefault(),v())}}function f(){p.togglePlaylist()}function E(){p.toggleExpanded()}function j(){p.toggleHidden()}function pe(){p.hideError()}function ke(h){}function _e(){return p.canSkip()}fe(()=>{b=p.subscribe(h=>{le(t,h)}),p.initialize()}),he(()=>{b&&b(),p.destroy()}),Fe();var ue=ee();Ee("keydown",Me,z);var Pe=Z(ue),Ce=h=>{var T=zt(),U=Z(T),K=V=>{var M=Et(),q=o(M),F=o(q);I(F,{icon:"material-symbols:error",class:"text-xl shrink-0"});var N=y(F,2),O=o(N,!0);a(N);var A=y(N,2);I(o(A),{icon:"material-symbols:close",class:"text-lg"}),a(A),a(q),a(M),D(()=>X(O,n(t).errorMessage)),L("click",A,pe),k(V,M)};H(U,V=>{n(t).showError&&V(K)});var te=y(U,2),ne=V=>{var M=ee(),q=Z(M),F=N=>{var O=Lt(),A=o(O);$e(o(A),{}),a(A),a(O),ye(3,A,()=>Qe,()=>({y:16,duration:280,opacity:.12,easing:Je})),k(N,O)};H(q,N=>{n(t).isExpanded&&N(F)}),k(V,M)},ie=V=>{var M=Dt();let q;var F=o(M);se(o(F),{get cover(){return n(t).currentSong.cover},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},size:"orb",onclick:j}),a(F);var N=y(F,2);{let A=ae(()=>n(t).isExpanded||n(t).isHidden);st(N,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isHidden(){return n(A)},onCoverClick:d,onInfoClick:E,onHideClick:j,onExpandClick:E})}var O=y(N,2);{let A=ae(_e),Se=ae(()=>!n(t).isExpanded);_t(O,{get song(){return n(t).currentSong},get currentTime(){return n(t).currentTime},get duration(){return n(t).duration},get isPlaying(){return n(t).isPlaying},get isLoading(){return n(t).isLoading},get isShuffled(){return n(t).isShuffled},get isRepeating(){return n(t).isRepeating},get showPlaylist(){return n(t).showPlaylist},get canSkip(){return n(A)},get volume(){return n(t).volume},get isMuted(){return n(t).isMuted},isVolumeDragging:!1,get isHidden(){return n(Se)},volumeBarRef:ke,onPlayClick:d,onPrevClick:P,onNextClick:()=>i(),onShuffleClick:c,onRepeatClick:g,onProgressClick:C,onProgressKeyDown:x,onVolumeButtonClick:_,onSliderPointerDown:w,onSliderKeyDown:z,onHideClick:j,onPlaylistClick:f,onCollapseClick:E})}Mt(y(O,2),{get playlist(){return n(t).playlist},get currentIndex(){return n(t).currentIndex},get isPlaying(){return n(t).isPlaying},get show(){return n(t).showPlaylist},onClose:f,onPlaySong:m}),a(M),D(()=>{q=B(M,1,"music-player fixed bottom-4 right-4 z-50 transition-all duration-300 ease-in-out",null,q,{expanded:n(t).isExpanded,"hidden-mode":n(t).isHidden}),B(F,1,`orb-player-container ${n(t).isHidden?"orb-enter pointer-events-auto":"orb-leave pointer-events-none"}`)}),k(V,M)};H(te,V=>{s?V(ne):V(ie,-1)}),Ie(2),k(h,T)};H(Pe,h=>{r&&h(Ce)}),k(u,ue),G()}Y(["click"]);export{Nt as default};
