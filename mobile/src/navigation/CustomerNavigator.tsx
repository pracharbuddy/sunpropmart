import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { supabase } from '../lib/supabase';

interface CustomerNavigatorProps {
  onSwitchToAgent: () => void;
}

export const CustomerNavigator: React.FC<CustomerNavigatorProps> = ({ onSwitchToAgent }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'favorites' | 'enquiries' | 'profile'>('home');
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .eq('status', 'published')
        .is('deleted_at', null)
        .order('created_at', { ascending: false });

      if (data && !error) {
        setProperties(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  const toggleFav = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredProperties = properties.filter((p) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      p.title?.toLowerCase().includes(q) ||
      p.locality?.toLowerCase().includes(q) ||
      p.city?.toLowerCase().includes(q)
    );
  });

  return (
    <View style={styles.container}>
      {/* Top Brand Bar */}
      <View style={styles.topBar}>
        <View>
          <Text style={styles.brandTitle}>SUNPROPMART</Text>
          <Text style={styles.brandSubtitle}>Find Your Dream Property in NCR</Text>
        </View>
        <TouchableOpacity style={styles.switchPill} onPress={onSwitchToAgent}>
          <Text style={styles.switchPillText}>Agent Mode ❯</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#E5B842" />
            <Text style={styles.loadingText}>Connecting to Supabase...</Text>
          </View>
        ) : selectedProperty ? (
          /* Property Detail View */
          <ScrollView style={styles.detailScroll}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setSelectedProperty(null)}
            >
              <Text style={styles.backBtnText}>❮ Back to Listings</Text>
            </TouchableOpacity>
            <Image
              source={{ uri: selectedProperty.featured_image }}
              style={styles.detailHeroImage}
            />
            <View style={styles.detailBody}>
              <View style={styles.badgeRow}>
                <Text style={styles.tagBadge}>
                  {selectedProperty.property_type || 'Apartment'}
                </Text>
                <Text style={styles.statusBadge}>Verified Listing</Text>
              </View>
              <Text style={styles.detailTitle}>{selectedProperty.title}</Text>
              <Text style={styles.detailLoc}>
                📍 {selectedProperty.locality}, {selectedProperty.city}
              </Text>

              <Text style={styles.detailPrice}>
                {selectedProperty.listing_type === 'rent'
                  ? `₹${selectedProperty.rent?.toLocaleString('en-IN') || 0} / mo`
                  : `₹${((selectedProperty.price || 0) / 10000000).toFixed(2)} Cr`}
              </Text>

              <View style={styles.specGrid}>
                <View style={styles.specBox}>
                  <Text style={styles.specVal}>{selectedProperty.bedrooms || 3} BHK</Text>
                  <Text style={styles.specKey}>Bedrooms</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specVal}>{selectedProperty.bathrooms || 3} Baths</Text>
                  <Text style={styles.specKey}>Bathrooms</Text>
                </View>
                <View style={styles.specBox}>
                  <Text style={styles.specVal}>{selectedProperty.area || 1500} sqft</Text>
                  <Text style={styles.specKey}>Super Area</Text>
                </View>
              </View>

              <Text style={styles.descHeading}>Description</Text>
              <Text style={styles.descBody}>{selectedProperty.description}</Text>

              <View style={styles.ctaRow}>
                <TouchableOpacity
                  style={[styles.favBtn, favorites.includes(selectedProperty.id) && styles.favBtnActive]}
                  onPress={() => toggleFav(selectedProperty.id)}
                >
                  <Text style={styles.favBtnText}>
                    {favorites.includes(selectedProperty.id) ? '♥ Saved' : '♡ Save'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.enquireBtn}
                  onPress={() => alert('Our property advisor will call you shortly.')}
                >
                  <Text style={styles.enquireBtnText}>Instant Enquiry</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        ) : (
          /* Tabs Rendering */
          <>
            {activeTab === 'home' && (
              <ScrollView style={styles.homeScroll}>
                <View style={styles.heroBanner}>
                  <Text style={styles.heroPre}>A BETTER TOMORROW</Text>
                  <Text style={styles.heroMain}>Buy, Rent or Invest</Text>
                  <Text style={styles.heroSub}>
                    Verified homes & luxury commercial spaces across Greater Noida & Yamuna Expressway.
                  </Text>
                </View>

                <View style={styles.sectionHeaderRow}>
                  <Text style={styles.sectionHeading}>Featured Listings</Text>
                  <Text style={styles.sectionCount}>{properties.length} Active</Text>
                </View>

                {properties.map((p) => (
                  <TouchableOpacity
                    key={p.id}
                    style={styles.propertyCard}
                    onPress={() => setSelectedProperty(p)}
                  >
                    <Image source={{ uri: p.featured_image }} style={styles.cardImage} />
                    <View style={styles.cardBody}>
                      <Text style={styles.cardPrice}>
                        {p.listing_type === 'rent'
                          ? `₹${p.rent?.toLocaleString('en-IN') || 0} / mo`
                          : `₹${((p.price || 0) / 10000000).toFixed(2)} Cr`}
                      </Text>
                      <Text style={styles.cardTitle} numberOfLines={1}>
                        {p.title}
                      </Text>
                      <Text style={styles.cardLoc} numberOfLines={1}>
                        📍 {p.locality}, {p.city}
                      </Text>
                      <View style={styles.cardSpecs}>
                        <Text style={styles.specText}>🛏 {p.bedrooms || 3} Beds</Text>
                        <Text style={styles.specText}>🚿 {p.bathrooms || 3} Baths</Text>
                        <Text style={styles.specText}>📐 {p.area || 1500} sqft</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            {activeTab === 'search' && (
              <View style={styles.searchContainer}>
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search locality, project, or title..."
                  placeholderTextColor="#64748B"
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <FlatList
                  data={filteredProperties}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.searchItem}
                      onPress={() => setSelectedProperty(item)}
                    >
                      <Image source={{ uri: item.featured_image }} style={styles.searchThumb} />
                      <View style={styles.searchDetails}>
                        <Text style={styles.searchTitle} numberOfLines={1}>
                          {item.title}
                        </Text>
                        <Text style={styles.searchLoc}>
                          {item.locality}, {item.city}
                        </Text>
                        <Text style={styles.searchPrice}>
                          ₹{((item.price || 0) / 10000000).toFixed(2)} Cr
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {activeTab === 'favorites' && (
              <View style={styles.paddedContainer}>
                <Text style={styles.sectionHeading}>Your Saved Properties</Text>
                {favorites.length === 0 ? (
                  <Text style={styles.emptyText}>No saved properties yet.</Text>
                ) : (
                  properties
                    .filter((p) => favorites.includes(p.id))
                    .map((p) => (
                      <TouchableOpacity
                        key={p.id}
                        style={styles.searchItem}
                        onPress={() => setSelectedProperty(p)}
                      >
                        <Image source={{ uri: p.featured_image }} style={styles.searchThumb} />
                        <View style={styles.searchDetails}>
                          <Text style={styles.searchTitle}>{p.title}</Text>
                          <Text style={styles.searchPrice}>
                            ₹{((p.price || 0) / 10000000).toFixed(2)} Cr
                          </Text>
                        </View>
                      </TouchableOpacity>
                    ))
                )}
              </View>
            )}

            {activeTab === 'enquiries' && (
              <View style={styles.paddedContainer}>
                <Text style={styles.sectionHeading}>Active Enquiries & Visits</Text>
                <View style={styles.enquiryCard}>
                  <Text style={styles.enquiryBadge}>STATUS: ASSIGNED</Text>
                  <Text style={styles.enquiryTitle}>Site Visit: ATS Nobility Sector 4</Text>
                  <Text style={styles.enquiryDate}>Scheduled for: Nov 05, 2026 at 11:00 AM</Text>
                  <Text style={styles.enquiryAgent}>Assigned Consultant: Rahul Sharma</Text>
                </View>
              </View>
            )}

            {activeTab === 'profile' && (
              <View style={styles.paddedContainer}>
                <Text style={styles.sectionHeading}>Client Account</Text>
                <View style={styles.profileBox}>
                  <Text style={styles.profileName}>Guest Client</Text>
                  <Text style={styles.profileDetail}>Connected via SunPropMart Mobile</Text>
                  <Text style={styles.profileDetail}>Phone: +91 98730 83899</Text>
                  <Text style={styles.profileDetail}>Office: Greater Noida Alpha-I Commercial Belt</Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Bottom Navigation Tabs */}
      <View style={styles.bottomNav}>
        {[
          { key: 'home', label: 'Home', icon: '🏠' },
          { key: 'search', label: 'Search', icon: '🔍' },
          { key: 'favorites', label: 'Saved', icon: '♥' },
          { key: 'enquiries', label: 'Enquiries', icon: '📋' },
          { key: 'profile', label: 'Profile', icon: '👤' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navTab}
            onPress={() => {
              setSelectedProperty(null);
              setActiveTab(tab.key as any);
            }}
          >
            <Text style={styles.navIcon}>{tab.icon}</Text>
            <Text
              style={[
                styles.navLabel,
                activeTab === tab.key && styles.navLabelActive,
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070D1A',
  },
  topBar: {
    paddingTop: 45,
    paddingHorizontal: 16,
    paddingBottom: 14,
    backgroundColor: '#0B1528',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandTitle: {
    color: '#E5B842',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  switchPill: {
    backgroundColor: 'rgba(229,184,66,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.3)',
  },
  switchPillText: {
    color: '#E5B842',
    fontSize: 11,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  centerBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#94A3B8',
    marginTop: 10,
    fontSize: 12,
  },
  homeScroll: {
    flex: 1,
    padding: 16,
  },
  heroBanner: {
    backgroundColor: '#0B1528',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.2)',
    marginBottom: 20,
  },
  heroPre: {
    color: '#E5B842',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1.5,
  },
  heroMain: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 4,
  },
  heroSub: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 6,
    lineHeight: 18,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionHeading: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  sectionCount: {
    color: '#E5B842',
    fontSize: 11,
    fontWeight: '600',
  },
  propertyCard: {
    backgroundColor: '#0F1D38',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  cardImage: {
    width: '100%',
    height: 160,
  },
  cardBody: {
    padding: 14,
  },
  cardPrice: {
    color: '#E5B842',
    fontSize: 18,
    fontWeight: 'bold',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  cardLoc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  cardSpecs: {
    flexDirection: 'row',
    gap: 14,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  specText: {
    color: '#CBD5E1',
    fontSize: 11,
  },
  searchContainer: {
    flex: 1,
    padding: 16,
  },
  searchInput: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#FFFFFF',
    fontSize: 13,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    marginBottom: 14,
  },
  searchItem: {
    flexDirection: 'row',
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  searchThumb: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  searchDetails: {
    marginLeft: 12,
    flex: 1,
    justifyContent: 'center',
  },
  searchTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchLoc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  searchPrice: {
    color: '#E5B842',
    fontSize: 13,
    fontWeight: 'bold',
    marginTop: 4,
  },
  paddedContainer: {
    padding: 16,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 13,
    marginTop: 10,
  },
  enquiryCard: {
    backgroundColor: '#0F1D38',
    padding: 16,
    borderRadius: 12,
    marginTop: 12,
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.2)',
  },
  enquiryBadge: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  enquiryTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  enquiryDate: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 4,
  },
  enquiryAgent: {
    color: '#E5B842',
    fontSize: 11,
    marginTop: 4,
  },
  profileBox: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  profileName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  profileDetail: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 6,
  },
  detailScroll: {
    flex: 1,
  },
  backBtn: {
    padding: 12,
  },
  backBtnText: {
    color: '#E5B842',
    fontSize: 12,
    fontWeight: 'bold',
  },
  detailHeroImage: {
    width: '100%',
    height: 240,
  },
  detailBody: {
    padding: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  tagBadge: {
    backgroundColor: 'rgba(229,184,66,0.15)',
    color: '#E5B842',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusBadge: {
    backgroundColor: 'rgba(16,185,129,0.15)',
    color: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  detailLoc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  detailPrice: {
    color: '#E5B842',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 8,
  },
  specGrid: {
    flexDirection: 'row',
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    justifyContent: 'space-around',
  },
  specBox: {
    alignItems: 'center',
  },
  specVal: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  specKey: {
    color: '#94A3B8',
    fontSize: 10,
    marginTop: 2,
  },
  descHeading: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 6,
  },
  descBody: {
    color: '#94A3B8',
    fontSize: 12,
    lineHeight: 18,
  },
  ctaRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  favBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#1E293B',
    alignItems: 'center',
  },
  favBtnActive: {
    backgroundColor: 'rgba(239,68,68,0.2)',
  },
  favBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  enquireBtn: {
    flex: 2,
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E5B842',
    alignItems: 'center',
  },
  enquireBtnText: {
    color: '#070D1A',
    fontSize: 13,
    fontWeight: 'bold',
  },
  bottomNav: {
    flexDirection: 'row',
    backgroundColor: '#0B1528',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 10,
    paddingBottom: 24,
  },
  navTab: {
    flex: 1,
    alignItems: 'center',
  },
  navIcon: {
    fontSize: 18,
  },
  navLabel: {
    color: '#64748B',
    fontSize: 10,
    marginTop: 2,
    fontWeight: '500',
  },
  navLabelActive: {
    color: '#E5B842',
    fontWeight: 'bold',
  },
});
