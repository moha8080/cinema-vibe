{GENRES.map((genre) => {
            const isSelected = hubGenre === genre.id;
            return (
              <button
                key={genre.id}
                onClick={() => setHubGenre(genre.id)}
                style={{
                  textAlign: 'right',
                  padding: '10px 14px',
                  borderRadius: '6px',
                  border: 'none',
                  backgroundColor: isSelected ? '#f97316' : 'transparent',
                  color: isSelected ? '#000' : '#d4d4d8',
                  fontWeight: isSelected ? 'bold' : 'normal',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'background 0.2s'
                }}
              >
                {genre.name}
              </button>
            );
          })}
            </div>
          </div>
          <div className="hub-content">
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', borderRight: '4px solid #f97316', paddingRight: '10px', marginTop: 0, marginBottom: '20px' }}>
              {activeTab === 'movies-hub' ? 'أفلام سينما فايب' : 'مسلسلات سينما فايب'}
            </h2>
            <MediaGrid items={hubItems} onSelect={openWatchPage} />
            {hasMoreHub && (
              <div style={{ textAlign: 'center', marginTop: '30px' }}>
                <button 
                  onClick={loadMoreHubItems}
                  style={{ backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
                >
                  تحميل المزيد
                </button>
              </div>
            )}
          </div>
        </div>
      ) : activeTab === 'catalog' ? (
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h2 style={{ fontSize: '20px', borderRight: '4px solid #f97316', paddingRight: '10px', margin: 0 }}>{catalogTitle}</h2>
            <button onClick={() => setActiveTab('home')} style={{ background: 'none', border: 'none', color: '#f97316', cursor: 'pointer', fontWeight: 'bold' }}>العودة للرئيسية</button>
          </div>
          <MediaGrid items={catalogItems} onSelect={openWatchPage} />
          {hasMoreCatalog && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                onClick={loadMoreCatalogItems}
                style={{ backgroundColor: '#27272a', color: '#fff', border: '1px solid #3f3f46', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px' }}
              >
                تحميل المزيد
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          {trending.length > 0 && heroItem && (
            <div style={{ position: 'relative', width: '100%', height: '480px', backgroundColor: '#000', overflow: 'hidden' }}>
              <img 
                src={`https://image.tmdb.org/t/p/original${heroItem.backdrop_path || heroItem.poster_path}`} 
                alt={heroItem.title || heroItem.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: '0.45' }} 
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #09090b 0%, rgba(9,9,11,0.6) 50%, transparent 100%)' }} />
              
              <div style={{ position: 'absolute', bottom: '40px', right: '30px', left: '30px', maxWidth: '700px' }}>
                <span style={{ backgroundColor: '#f97316', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold', display: 'inline-block', marginBottom: '10px' }}>
                  رائج الآن
                </span>
                <h2 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', margin: '0 0 10px 0', direction: 'ltr', textAlign: 'left' }}>
                  {heroItem.title || heroItem.name}
                </h2>
                <p style={{ fontSize: '13px', color: '#d4d4d8', margin: '0 0 20px 0', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>
                  {heroItem.overview || 'استمتع بمشاهدة هذا العمل الحصري بجودة عالية وحصرياً على سينما فايب.'}
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button 
                    onClick={() => openWatchPage(heroItem)}
                    style={{ backgroundColor: '#f97316', color: '#000', border: 'none', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    مشاهدة الآن
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ padding: '24px 16px', maxWidth: '1400px', margin: '0 auto' }}>
            <HorizontalRow title="أفلام ومسلسلات أضيفت هذا الشهر" items={thisMonthMixed} rowRef={rowRefs.thisMonth} onSeeMore={() => openCatalog('movie', '0', 'أحدث الإصدارات')} />
            <HorizontalRow title="ترشيح جوائز الأوسكار" items={oscarsMixed} rowRef={rowRefs.oscars} onSeeMore={() => openCatalog('movie', '18,36', 'ترشيح جوائز الأوسكار')} />
            <HorizontalRow title="الأعلى تقييماً" items={topRatedMixed} rowRef={rowRefs.topRated} onSeeMore={() => openCatalog('movie', '0', 'الأعلى تقييماً')} />
            <HorizontalRow title="أكشن ومغامرة" items={actionMixed} rowRef={rowRefs.action} onSeeMore={() => openCatalog('movie', '28', 'أكشن ومغامرة')} />
            <HorizontalRow title="دراما مؤثرة" items={dramaMixed} rowRef={rowRefs.drama} onSeeMore={() => openCatalog('movie', '18', 'دراما مؤثرة')} />
            <HorizontalRow title="رعب وإثارة" items={horrorThrillerMixed} rowRef={rowRefs.horror} onSeeMore={() => openCatalog('movie', '27', 'رعب وإثارة')} />
            <HorizontalRow title="خيال علمي وفضاء" items={sciFiAdventureMixed} rowRef={rowRefs.scifi} onSeeMore={() => openCatalog('movie', '878', 'خيال علمي وفضاء')} />
            <HorizontalRow title="غموض وتحقيق" items={mysteryMixed} rowRef={rowRefs.mystery} onSeeMore={() => openCatalog('movie', '9648', 'غموض وتحقيق')} />
            <HorizontalRow title="كوميديا وضاحكة" items={comedyMixed} rowRef={rowRefs.comedy} onSeeMore={() => openCatalog('movie', '35', 'كوميديا وضاحكة')} />
            <HorizontalRow title="تشويق وجريمة" items={suspenseMixed} rowRef={rowRefs.suspense} onSeeMore={() => openCatalog('movie', '53', 'تشويق وجريمة')} />
          </div>
        </div>
      )}

      <footer style={{ textAlign: 'center', padding: '30px 16px', borderTop: '1px solid #27272a', color: '#a1a1aa', fontSize: '13px', marginTop: '40px' }}>
        <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: '#f97316' }}>Cinema Vibe - سينما فايب</p>
        <p style={{ margin: 0 }}>جميع الحقوق محفوظة لموقع سينما فايب © 2026</p>
      </footer>
    </div>
  );
}
