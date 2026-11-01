import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { supabase } from '../lib/supabase';
import { PropertyUploadForm } from '../components/PropertyUploadForm';

interface AgentNavigatorProps {
  onSwitchToCustomer: () => void;
}

export const AgentNavigator: React.FC<AgentNavigatorProps> = ({ onSwitchToCustomer }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'properties' | 'leads' | 'visits' | 'profile'>('dashboard');
  const [isAddPropertyOpen, setIsAddPropertyOpen] = useState(false);
  const [properties, setProperties] = useState<any[]>([]);
  const [leads, setLeads] = useState<any[]>([]);
  const [siteVisits, setSiteVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Active simulated agent ID
  const agentId = 'usr-agent-01';

  useEffect(() => {
    fetchAgentData();
  }, []);

  const fetchAgentData = async () => {
    setLoading(true);
    try {
      // 1. Fetch properties assigned to or created by agent
      const { data: propData } = await supabase
        .from('properties')
        .select('*')
        .or(`created_by.eq.${agentId},assigned_agent_id.eq.${agentId}`)
        .order('created_at', { ascending: false });

      if (propData) setProperties(propData);

      // 2. Fetch scoped leads
      const { data: leadData } = await supabase
        .from('leads')
        .select('*')
        .eq('assigned_agent_id', agentId)
        .order('created_at', { ascending: false });

      if (leadData) setLeads(leadData);

      // 3. Fetch scoped visits
      const { data: visitData } = await supabase
        .from('site_visits')
        .select('*')
        .eq('assigned_agent_id', agentId)
        .order('created_at', { ascending: false });

      if (visitData) setSiteVisits(visitData);
    } catch {
      // Error handling
    } finally {
      setLoading(false);
    }
  };

  const handlePriceRequest = (prop: any) => {
    Alert.prompt
      ? Alert.prompt(
          'Request Price Change',
          `Current Price: ₹${prop.price}. Enter new requested amount:`,
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Submit Request',
              onPress: async (val) => {
                if (!val) return;
                const { error } = await supabase
                  .from('property_price_change_requests')
                  .insert({
                    property_id: prop.id,
                    requested_by: agentId,
                    proposed_price: Number(val),
                    reason: 'Market adjustment request via Agent Mobile App',
                  });
                if (!error) {
                  Alert.alert('Request Sent', 'Your price revision request has been forwarded to Admin.');
                }
              },
            },
          ],
          'plain-text',
          '',
          'numeric'
        )
      : Alert.alert('Request Price Change', 'Price requests are submitted to Admin for approval under strict RBAC rules.');
  };

  const handleDeleteRequest = (prop: any) => {
    Alert.alert(
      'Request Property Archive',
      `Agents cannot delete properties directly. Do you wish to submit an archive request for "${prop.title}" to the Admin?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Request Archive',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase
              .from('property_delete_requests')
              .insert({
                property_id: prop.id,
                requested_by: agentId,
                reason: 'Listing decommission request via Agent Mobile App',
              });
            if (!error) {
              Alert.alert('Archive Request Submitted', 'Admin will review and approve the decommission.');
            }
          },
        },
      ]
    );
  };

  if (isAddPropertyOpen) {
    return (
      <View style={styles.container}>
        <PropertyUploadForm
          agentId={agentId}
          onSuccess={() => {
            setIsAddPropertyOpen(false);
            fetchAgentData();
          }}
          onCancel={() => setIsAddPropertyOpen(false)}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Top Agent Bar */}
      <View style={styles.topBar}>
        <View>
          <View style={styles.badgeRow}>
            <Text style={styles.agentBadge}>AGENT CONSOLE</Text>
            <Text style={styles.rbacPill}>RBAC ACTIVE</Text>
          </View>
          <Text style={styles.agentName}>Rahul Sharma (Senior Consultant)</Text>
        </View>
        <TouchableOpacity style={styles.switchPill} onPress={onSwitchToCustomer}>
          <Text style={styles.switchPillText}>Customer Mode ❯</Text>
        </TouchableOpacity>
      </View>

      {/* Body Content */}
      <View style={styles.content}>
        {loading ? (
          <View style={styles.centerBox}>
            <ActivityIndicator size="large" color="#E5B842" />
            <Text style={styles.loadingText}>Syncing Agent Scope from Supabase...</Text>
          </View>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <ScrollView style={styles.scroll}>
                {/* Metric Cards */}
                <View style={styles.metricsGrid}>
                  <View style={styles.metricCard}>
                    <Text style={styles.metricNum}>{properties.length}</Text>
                    <Text style={styles.metricLabel}>My Listings</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={[styles.metricNum, { color: '#F59E0B' }]}>
                      {properties.filter((p) => p.status === 'under_review').length}
                    </Text>
                    <Text style={styles.metricLabel}>Pending Review</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={[styles.metricNum, { color: '#10B981' }]}>
                      {leads.length}
                    </Text>
                    <Text style={styles.metricLabel}>Assigned Leads</Text>
                  </View>
                  <View style={styles.metricCard}>
                    <Text style={[styles.metricNum, { color: '#38BDF8' }]}>
                      {siteVisits.length}
                    </Text>
                    <Text style={styles.metricLabel}>Site Visits</Text>
                  </View>
                </View>

                {/* Quick Add Action */}
                <TouchableOpacity
                  style={styles.addPropertyBanner}
                  onPress={() => setIsAddPropertyOpen(true)}
                >
                  <Text style={styles.addIcon}>＋</Text>
                  <View>
                    <Text style={styles.addTitle}>Add New Listing</Text>
                    <Text style={styles.addSub}>
                      Capture photos, upload specifications, and submit for admin review.
                    </Text>
                  </View>
                </TouchableOpacity>

                {/* Recent Leads */}
                <Text style={styles.sectionTitle}>Recent Assigned Leads</Text>
                {leads.length === 0 ? (
                  <Text style={styles.emptyText}>No leads assigned yet.</Text>
                ) : (
                  leads.slice(0, 3).map((lead) => (
                    <View key={lead.id} style={styles.leadCard}>
                      <View style={styles.leadHead}>
                        <Text style={styles.leadName}>{lead.full_name}</Text>
                        <Text style={styles.leadStatus}>{lead.status || 'New'}</Text>
                      </View>
                      <Text style={styles.leadMeta}>
                        📞 {lead.phone} | ✉ {lead.email}
                      </Text>
                      <Text style={styles.leadPref}>
                        Budget: {lead.budget_range || 'Flexible'} • {lead.preferred_location || 'NCR'}
                      </Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}

            {activeTab === 'properties' && (
              <ScrollView style={styles.scroll}>
                <View style={styles.propHeader}>
                  <Text style={styles.sectionTitle}>My Managed Properties</Text>
                  <TouchableOpacity
                    style={styles.addSmallBtn}
                    onPress={() => setIsAddPropertyOpen(true)}
                  >
                    <Text style={styles.addSmallBtnText}>＋ Add</Text>
                  </TouchableOpacity>
                </View>

                {properties.map((p) => (
                  <View key={p.id} style={styles.propItem}>
                    <View style={styles.propItemHead}>
                      <Text style={styles.propItemTitle} numberOfLines={1}>
                        {p.title}
                      </Text>
                      <Text
                        style={[
                          styles.statusPill,
                          p.status === 'published' && styles.statusPublished,
                          p.status === 'under_review' && styles.statusReview,
                          p.status === 'draft' && styles.statusDraft,
                        ]}
                      >
                        {p.status}
                      </Text>
                    </View>

                    <Text style={styles.propItemPrice}>
                      {p.listing_type === 'rent'
                        ? `₹${p.rent?.toLocaleString('en-IN') || 0} / mo`
                        : `₹${((p.price || 0) / 10000000).toFixed(2)} Cr`}
                    </Text>
                    <Text style={styles.propItemLoc}>
                      {p.locality}, {p.city}
                    </Text>

                    {/* Agent RBAC Controls: Cannot direct delete, cannot direct price change */}
                    <View style={styles.propActions}>
                      <TouchableOpacity
                        style={styles.actionBtnSecondary}
                        onPress={() => handlePriceRequest(p)}
                      >
                        <Text style={styles.actionBtnSecondaryText}>Req Price Change</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtnDanger}
                        onPress={() => handleDeleteRequest(p)}
                      >
                        <Text style={styles.actionBtnDangerText}>Req Archive</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'leads' && (
              <ScrollView style={styles.scroll}>
                <Text style={styles.sectionTitle}>CRM Assigned Leads ({leads.length})</Text>
                {leads.map((l) => (
                  <View key={l.id} style={styles.leadCard}>
                    <View style={styles.leadHead}>
                      <Text style={styles.leadName}>{l.full_name}</Text>
                      <Text style={styles.leadStatus}>{l.status}</Text>
                    </View>
                    <Text style={styles.leadMeta}>
                      📞 {l.phone} • {l.email}
                    </Text>
                    <Text style={styles.leadPref}>{l.message || 'Interested in property consultation.'}</Text>
                  </View>
                ))}
              </ScrollView>
            )}

            {activeTab === 'visits' && (
              <ScrollView style={styles.scroll}>
                <Text style={styles.sectionTitle}>Scheduled Site Visits ({siteVisits.length})</Text>
                {siteVisits.length === 0 ? (
                  <Text style={styles.emptyText}>No visits scheduled for today.</Text>
                ) : (
                  siteVisits.map((v) => (
                    <View key={v.id} style={styles.visitCard}>
                      <Text style={styles.visitDate}>
                        📅 {v.preferred_date} at {v.preferred_time || '11:00 AM'}
                      </Text>
                      <Text style={styles.visitStatus}>STATUS: {v.status}</Text>
                      <Text style={styles.visitLoc}>Client: {v.customer_name || 'Verified Client'}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
            )}

            {activeTab === 'profile' && (
              <View style={styles.paddedContainer}>
                <Text style={styles.sectionTitle}>Agent Profile</Text>
                <View style={styles.profileBox}>
                  <Text style={styles.profileName}>Rahul Sharma</Text>
                  <Text style={styles.profileDetail}>Role: Senior Property Consultant (agent)</Text>
                  <Text style={styles.profileDetail}>ID: SPM-AG-102</Text>
                  <Text style={styles.profileDetail}>Territory: Greater Noida West & Noida</Text>
                  <Text style={styles.profileDetail}>Direct Permissions: Add, Draft, Edit Own Listings</Text>
                  <Text style={[styles.profileDetail, { color: '#F59E0B' }]}>
                    Restricted: Delete and Direct Publish require Admin Approval
                  </Text>
                </View>
              </View>
            )}
          </>
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        {[
          { key: 'dashboard', label: 'Dashboard', icon: '📊' },
          { key: 'properties', label: 'Listings', icon: '🏢' },
          { key: 'leads', label: 'Leads', icon: '👥' },
          { key: 'visits', label: 'Visits', icon: '📅' },
          { key: 'profile', label: 'Profile', icon: '👤' },
        ].map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={styles.navTab}
            onPress={() => setActiveTab(tab.key as any)}
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
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  agentBadge: {
    color: '#E5B842',
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  rbacPill: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    color: '#10B981',
    fontSize: 9,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: 'bold',
  },
  agentName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
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
  scroll: {
    flex: 1,
    padding: 16,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#0F1D38',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  metricNum: {
    color: '#E5B842',
    fontSize: 22,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  addPropertyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1D38',
    borderWidth: 1,
    borderColor: 'rgba(229,184,66,0.3)',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    gap: 14,
  },
  addIcon: {
    color: '#E5B842',
    fontSize: 26,
    fontWeight: 'bold',
  },
  addTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
  },
  addSub: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
    maxWidth: 240,
  },
  sectionTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  propHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addSmallBtn: {
    backgroundColor: '#E5B842',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  addSmallBtnText: {
    color: '#070D1A',
    fontSize: 11,
    fontWeight: 'bold',
  },
  propItem: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  propItemHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  propItemTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  statusPill: {
    fontSize: 10,
    fontWeight: 'bold',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    textTransform: 'uppercase',
  },
  statusPublished: {
    backgroundColor: 'rgba(16,185,129,0.2)',
    color: '#10B981',
  },
  statusReview: {
    backgroundColor: 'rgba(245,158,11,0.2)',
    color: '#F59E0B',
  },
  statusDraft: {
    backgroundColor: 'rgba(148,163,184,0.2)',
    color: '#94A3B8',
  },
  propItemPrice: {
    color: '#E5B842',
    fontSize: 15,
    fontWeight: 'bold',
    marginTop: 4,
  },
  propItemLoc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 2,
  },
  propActions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  actionBtnSecondary: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 8,
  },
  actionBtnSecondaryText: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '600',
  },
  actionBtnDanger: {
    flex: 1,
    paddingVertical: 6,
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.15)',
    borderRadius: 8,
  },
  actionBtnDangerText: {
    color: '#EF4444',
    fontSize: 11,
    fontWeight: '600',
  },
  leadCard: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  leadHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leadName: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  leadStatus: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
  },
  leadMeta: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  leadPref: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 4,
  },
  visitCard: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  visitDate: {
    color: '#E5B842',
    fontSize: 13,
    fontWeight: 'bold',
  },
  visitStatus: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 3,
  },
  visitLoc: {
    color: '#94A3B8',
    fontSize: 11,
    marginTop: 3,
  },
  paddedContainer: {
    padding: 16,
  },
  profileBox: {
    backgroundColor: '#0F1D38',
    borderRadius: 12,
    padding: 16,
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
  emptyText: {
    color: '#64748B',
    fontSize: 12,
    marginTop: 6,
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
