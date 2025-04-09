import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toast } from 'sonner-native';

export default function SettingsScreen() {
  const [settings, setSettings] = useState({
    notifications: true,
    dailyReminder: true,
    soundEffects: true,
    darkMode: false,
    autoPlay: false,
  });

  const [language, setLanguage] = useState('English');

  const handleSettingChange = (setting, value) => {
    setSettings(prev => ({ ...prev, [setting]: value }));
    toast.success(`${setting} ${value ? 'enabled' : 'disabled'}`);
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to clear all your data? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: () => {
            // Here you would typically clear the user's data
            toast.success('All data has been cleared');
          },
        },
      ]
    );
  };

  const renderSettingItem = (title, value, onToggle, icon) => (
    <View style={styles.settingItem}>
      <View style={styles.settingLeft}>
        <Ionicons name={icon} size={24} color="#007AFF" style={styles.settingIcon} />
        <Text style={styles.settingText}>{title}</Text>
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        ios_backgroundColor="#CCC"
        trackColor={{ false: '#CCC', true: '#007AFF' }}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          {renderSettingItem(
            'Push Notifications',
            settings.notifications,
            (value) => handleSettingChange('notifications', value),
            'notifications'
          )}
          {renderSettingItem(
            'Daily Reminder',
            settings.dailyReminder,
            (value) => handleSettingChange('dailyReminder', value),
            'alarm'
          )}
          {renderSettingItem(
            'Sound Effects',
            settings.soundEffects,
            (value) => handleSettingChange('soundEffects', value),
            'volume-high'
          )}
          {renderSettingItem(
            'Dark Mode',
            settings.darkMode,
            (value) => handleSettingChange('darkMode', value),
            'moon'
          )}
          {renderSettingItem(
            'Auto-play Pronunciations',
            settings.autoPlay,
            (value) => handleSettingChange('autoPlay', value),
            'play'
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Language</Text>
          <TouchableOpacity style={styles.languageSelector}>
            <View style={styles.settingLeft}>
              <Ionicons name="language" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingText}>Interface Language</Text>
            </View>
            <View style={styles.languageRight}>
              <Text style={styles.languageText}>{language}</Text>
              <Ionicons name="chevron-forward" size={24} color="#666" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity style={styles.accountButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="person" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingText}>Edit Profile</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.accountButton}>
            <View style={styles.settingLeft}>
              <Ionicons name="key" size={24} color="#007AFF" style={styles.settingIcon} />
              <Text style={styles.settingText}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          <TouchableOpacity 
            style={styles.dangerButton}
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Ionicons name="trash" size={24} color="#FF3B30" style={styles.settingIcon} />
              <Text style={styles.dangerText}>Clear All Data</Text>
            </View>
            <Ionicons name="chevron-forward" size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          <View style={styles.versionContainer}>
            <Text style={styles.versionText}>Version 1.0.0</Text>
            <TouchableOpacity>
              <Text style={styles.checkUpdatesText}>Check for Updates</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
    backgroundColor: 'white',
    borderRadius: 12,
    marginHorizontal: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 12,
  },
  settingText: {
    fontSize: 16,
    color: '#333',
  },
  languageSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  languageRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  languageText: {
    fontSize: 16,
    color: '#666',
    marginRight: 8,
  },
  accountButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E8E8',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  dangerText: {
    fontSize: 16,
    color: '#FF3B30',
  },
  versionContainer: {
    alignItems: 'center',
  },
  versionText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 8,
  },
  checkUpdatesText: {
    fontSize: 16,
    color: '#007AFF',
  },
});