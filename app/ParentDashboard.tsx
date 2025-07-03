import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, Alert, ImageBackground, Modal, Pressable } from 'react-native';
import { MaterialIcons, FontAwesome, Feather } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
const bgImage = require('../assets/images/bg.jpg');

const { width } = Dimensions.get('window');

const initialTasks = [
  { title: 'Sample Task 1', status: 'done', details: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore. Ut enim ad minim veniam.' },
  { title: 'Sample Task 2', status: 'ongoing', details: 'Quis nostrud exercitation ullamco laboris nisi. Ut aliquip ex ea commodo consequat.Duis aute irure dolor in reprehenderit.' },
  { title: 'Sample Task 3', status: 'notdone', details: 'Excepteur sint occaecat cupidatat non proident. Sunt in culpa qui officia deserunt mollit anim. Id est laborum.' },
  { title: 'Sample Task 4', status: 'notdone', details: 'Curabitur non nulla sit amet nisl tempus. Vestibulum ac diam sit amet quam vehicula.Vivamus magna justo, lacinia eget consectetur.' },
  { title: 'Sample Task 5', status: 'notdone', details: 'Pellentesque in ipsum id orci porta dapibus. Praesent sapien massa, convallis a pellentesque.Donec sollicitudin molestie malesuada.' },
  { title: 'Sample Task 6', status: 'notdone', details: 'Mauris blandit aliquet elit, eget tinciduntNulla quis lorem ut libero malesuada feugiat. Vestibulum ante ipsum primis in faucibus.' },
];

// Type for announcement
type Announcement = {
  id: number;
  teacher: { name: string; grade: string; avatar: string };
  text: string;
  date: string;
  time: string;
};

const initialAnnouncements = [
  {
    id: 1,
    teacher: {
      name: 'Mrs. Loteriña',
      grade: 'Grade 1 Teacher',
      avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    },
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum vestibulum lectus, eget eleifend tellus dignissim non. Praesent ultrices faucibus condimentum.',
    date: '2024-06-01',
    time: '09:15',
  },
  {
    id: 2,
    teacher: {
      name: 'Mr. Santos',
      grade: 'Grade 2 Teacher',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    },
    text: 'Aliquam erat volutpat. Etiam euismod, urna eu tincidunt consectetur, nisi nisl aliquam velit.',
    date: '2024-06-02',
    time: '11:30',
  },
  {
    id: 3,
    teacher: {
      name: 'Ms. Cruz',
      grade: 'Grade 3 Teacher',
      avatar: 'https://randomuser.me/api/portraits/women/65.jpg',
    },
    text: 'Suspendisse potenti. Pellentesque habitant morbi tristique senectus et netus.',
    date: '2024-06-03',
    time: '13:45',
  },
];

export default function ParentDashboard() {
  // Placeholder data
  const parentLRN = 'PARENT108756090030';
  const teacher = {
    name: 'Mrs. Loteriña',
    grade: 'Grade 1 Teacher',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    announcement: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fermentum vestibulum lectus, eget eleifend tellus dignissim non. Praesent ultrices faucibus condimentum.'
  };
  const pretest = { percent: 35, score: 3, total: 10 };
  const posttest = { percent: 0, score: 0, total: 10 };
  const [tasks, setTasks] = useState(initialTasks);
  const [announcements] = useState<Announcement[]>(initialAnnouncements);
  const [modalVisible, setModalVisible] = useState(false);
  const [focusedAnnouncement, setFocusedAnnouncement] = useState<Announcement | null>(null);
  const [changeModalVisible, setChangeModalVisible] = useState(false);
  const [changeTaskIdx, setChangeTaskIdx] = useState<number | null>(null);
  const [changeReason, setChangeReason] = useState<string>('');
  const [changeReasonOther, setChangeReasonOther] = useState<string>('');

  // Calculate overall progress
  const doneCount = tasks.filter(t => t.status === 'done').length;
  const progressPercent = Math.round((doneCount / tasks.length) * 100);

  // Task status label
  const statusLabel = (status: string) => {
    if (status === 'done') return 'Done';
    if (status === 'ongoing') return 'Ongoing';
    return 'Not Done';
  };

  // Handle task click
  const handleTaskPress = (idx: number) => {
    const task = tasks[idx];
    if (task.status === 'done') return;
    if (task.status === 'notdone') {
      Alert.alert(
        'Start Task',
        `Mark "${task.title}" as Ongoing?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              const newTasks = [...tasks];
              newTasks[idx] = { ...newTasks[idx], status: 'ongoing' };
              setTasks(newTasks);
            },
          },
        ]
      );
    } else if (task.status === 'ongoing') {
      Alert.alert(
        'Finish Task',
        `Mark "${task.title}" as Done?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Yes',
            onPress: () => {
              const newTasks = [...tasks];
              newTasks[idx] = { ...newTasks[idx], status: 'done' };
              setTasks(newTasks);
            },
          },
        ]
      );
    }
  };

  // Handle post-test click
  const handlePostTest = () => {
    if (doneCount !== tasks.length) {
      Alert.alert('Cannot Start Post-Test', 'You must finish all tasks before starting the post-test.');
      return;
    }
    // Proceed to post-test
  };

  // Add a placeholder user profile image
  const userProfile = {
    name: 'Parent User',
    avatar: 'https://randomuser.me/api/portraits/men/99.jpg',
  };

  // Handler for announcement click
  const handleAnnouncementPress = (announcement: Announcement) => {
    setFocusedAnnouncement(announcement);
    setModalVisible(true);
  };

  // Handle change button click
  const handleChangePress = (idx: number) => {
    Alert.alert(
      'Request Change',
      `Are you sure you want to request a change for "${tasks[idx].title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Yes',
          onPress: () => {
            setChangeTaskIdx(idx);
            setChangeModalVisible(true);
          },
        },
      ]
    );
  };

  // Handle submit reason
  const handleSubmitChangeReason = () => {
    let reason = changeReason;
    if (changeReason === 'Other') {
      reason = changeReasonOther;
    }
    setChangeModalVisible(false);
    setChangeReason('');
    setChangeReasonOther('');
    setChangeTaskIdx(null);
    Alert.alert('Change Requested', `Reason: ${reason}`);
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg} imageStyle={{ opacity: 0.13, resizeMode: 'cover' }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32 }}>
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Welcome,</Text>
              <Text style={styles.lrn}>{parentLRN}</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <Image source={{ uri: userProfile.avatar }} style={styles.profileIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Announcements</Text>
          <View style={styles.greenDot} />
        </View>
        {/* Horizontal scrollable announcements */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.announcementScroll}
          contentContainerStyle={{ paddingLeft: 8, paddingRight: 8 }}
        >
          {[...announcements].reverse().map((a, idx) => (
            <TouchableOpacity
              key={a.id}
              style={[styles.announcementBox, { marginRight: idx === announcements.length - 1 ? 0 : 16 }]}
              activeOpacity={0.85}
              onPress={() => handleAnnouncementPress(a)}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                <Image source={{ uri: a.teacher.avatar }} style={styles.teacherAvatar} />
                <View style={{ marginLeft: 10 }}>
                  <Text style={styles.teacherName}>{a.teacher.name}</Text>
                  <Text style={styles.teacherGrade}>{a.teacher.grade}</Text>
                </View>
              </View>
              <View style={styles.announcementTextScrollWrap}>
                <ScrollView style={styles.announcementTextScroll} showsVerticalScrollIndicator={false}>
                  <Text style={styles.announcementText} numberOfLines={3} ellipsizeMode="tail">{a.text}</Text>
                </ScrollView>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={styles.announcementDate}>{a.date}</Text>
                <Text style={styles.announcementTime}>{a.time}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Modal for focused announcement */}
        <Modal
          visible={modalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setModalVisible(false)}
        >
          <BlurView intensity={60} tint="light" style={styles.modalBlur}>
            <View style={styles.modalCenterWrap}>
              <View style={styles.modalAnnouncementBox}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Image source={{ uri: focusedAnnouncement?.teacher.avatar }} style={styles.teacherAvatar} />
                  <View style={{ marginLeft: 10 }}>
                    <Text style={styles.teacherName}>{focusedAnnouncement?.teacher.name}</Text>
                    <Text style={styles.teacherGrade}>{focusedAnnouncement?.teacher.grade}</Text>
                  </View>
                </View>
                <Text style={styles.modalAnnouncementText}>{focusedAnnouncement?.text}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
                  <Text style={styles.announcementDate}>{focusedAnnouncement?.date}</Text>
                  <Text style={styles.announcementTime}>{focusedAnnouncement?.time}</Text>
                </View>
                <Pressable style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
                  <Text style={styles.modalCloseBtnText}>Close</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>

        <View style={styles.progressRowCardWrap}>
          <View style={styles.progressCardSingle}>
            <View style={styles.progressCol}>
              <View style={styles.circleWrap}>
                <View style={[styles.circle, { borderColor: '#2ecc40' }] }>
                  <Text style={[styles.circleText, { color: '#2ecc40' }]}>{pretest.percent}%</Text>
                </View>
              </View>
              <Text style={styles.progressLabel}>Pretest</Text>
              <Text style={styles.progressScore}>{`${pretest.score}/${pretest.total}`}</Text>
            </View>
          </View>
          <View style={styles.progressCardSingle}>
            <View style={styles.progressCol}>
              <View style={styles.circleWrap}>
                <View style={[styles.circle, { borderColor: '#ff5a5a' }] }>
                  <Text style={[styles.circleText, { color: '#ff5a5a' }]}>{posttest.percent}%</Text>
                </View>
              </View>
              <Text style={styles.progressLabel}>Post-test</Text>
              <Text style={styles.progressScore}>{`${posttest.score}/${posttest.total}`}</Text>
            </View>
          </View>
        </View>

        <View style={styles.tasksBox}>
          <View style={styles.tasksTitleRow}>
            <Text style={styles.tasksTitle}>Tasks</Text>
            <View style={styles.generalProgressWrap}>
              <View style={[styles.generalProgressBar, { width: `${progressPercent}%` }]} />
            </View>
            <Text style={styles.generalProgressText}>{`${progressPercent}%`}</Text>
          </View>
          {/* Scrollable tasks list */}
          {tasks.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.taskRow}
              onPress={() => handleTaskPress(index)}
              activeOpacity={item.status === 'done' ? 1 : 0.8}
            >
              <View style={{ flex: 1 }}>
                <View style={styles.taskTitleRow}>
                  <View style={[styles.taskNum, item.status === 'done' ? styles.taskNumDone : styles.taskNumGray]}>
                    <Text style={[styles.taskNumText, item.status === 'done' ? styles.taskNumTextDone : styles.taskNumTextGray]}>{index + 1}</Text>
                  </View>
                  <Text style={styles.taskTitleSmall}>{item.title}</Text>
                </View>
                {!!item.details && (
                  <Text style={styles.taskDetails}>{item.details}</Text>
                )}
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.taskStatus, item.status === 'done' ? styles.statusDone : item.status === 'ongoing' ? styles.statusOngoing : styles.statusNotDone]}>
                  {item.status === 'done' && <MaterialIcons name="check-circle" size={16} color="#2ecc40" style={{ marginRight: 4 }} />}
                  {item.status === 'ongoing' && <MaterialIcons name="access-time" size={16} color="#f1c40f" style={{ marginRight: 4 }} />}
                  {item.status === 'notdone' && <MaterialIcons name="radio-button-unchecked" size={16} color="#bbb" style={{ marginRight: 4 }} />}
                  <Text style={{ fontWeight: 'bold', fontSize: 13 }}>{statusLabel(item.status)}</Text>
                </View>
                {/* Change button */}
                {item.status === 'notdone' && (
                  <TouchableOpacity
                    style={styles.changeBtn}
                    onPress={() => handleChangePress(index)}
                  >
                    <Feather name="refresh-cw" size={20} color="#2ecc40" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Change Reason Modal */}
        <Modal
          visible={changeModalVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setChangeModalVisible(false)}
        >
          <BlurView intensity={60} tint="light" style={styles.modalBlur}>
            <View style={styles.modalCenterWrap}>
              <View style={styles.modalAnnouncementBox}>
                <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Reason for Change</Text>
                <TouchableOpacity
                  style={[styles.reasonOption, changeReason === 'Time' && styles.reasonOptionSelected]}
                  onPress={() => setChangeReason('Time')}
                >
                  <Text style={styles.reasonOptionText}>Time</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reasonOption, changeReason === 'Resources' && styles.reasonOptionSelected]}
                  onPress={() => setChangeReason('Resources')}
                >
                  <Text style={styles.reasonOptionText}>Resources</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.reasonOption, changeReason === 'Other' && styles.reasonOptionSelected]}
                  onPress={() => setChangeReason('Other')}
                >
                  <Text style={styles.reasonOptionText}>Other</Text>
                </TouchableOpacity>
                {changeReason === 'Other' && (
                  <View style={{ marginTop: 10, width: '100%' }}>
                    <Text style={{ fontSize: 14, color: '#222', marginBottom: 4 }}>Please specify:</Text>
                    <View style={{ backgroundColor: '#f3f3f3', borderRadius: 8, padding: 6 }}>
                      <Text
                        style={{ minHeight: 32, fontSize: 15, color: '#222' }}
                        numberOfLines={3}
                        ellipsizeMode="tail"
                      >
                        {/* This is a placeholder for a TextInput, but since TextInput is not imported, use Alert for now. */}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{ marginTop: 6, alignSelf: 'flex-end' }}
                      onPress={async () => {
                        const input = prompt('Please specify your reason:');
                        if (input) setChangeReasonOther(input);
                      }}
                    >
                      <Text style={{ color: '#2ecc40', fontWeight: 'bold' }}>Enter Reason</Text>
                    </TouchableOpacity>
                    {changeReasonOther ? (
                      <Text style={{ color: '#888', marginTop: 2 }}>Entered: {changeReasonOther}</Text>
                    ) : null}
                  </View>
                )}
                <Pressable
                  style={[styles.modalCloseBtn, { marginTop: 18, backgroundColor: '#2ecc40', opacity: changeReason ? 1 : 0.5 }]}
                  onPress={handleSubmitChangeReason}
                  disabled={!changeReason || (changeReason === 'Other' && !changeReasonOther)}
                >
                  <Text style={styles.modalCloseBtnText}>Submit</Text>
                </Pressable>
                <Pressable style={[styles.modalCloseBtn, { marginTop: 8, backgroundColor: '#bbb' }]} onPress={() => setChangeModalVisible(false)}>
                  <Text style={styles.modalCloseBtnText}>Cancel</Text>
                </Pressable>
              </View>
            </View>
          </BlurView>
        </Modal>
      </ScrollView>
    </ImageBackground>
  );
}

const CIRCLE_SIZE = 80;
const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f7fafd',
  },
  headerWrap: {
    width: '100%',
    paddingTop: 24,
    paddingBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.93)',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 1 },
    borderBottomWidth: 0.5,
    borderColor: '#e6e6e6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
    marginTop: 0,
    marginBottom: 0,
  },
  welcome: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    letterSpacing: 0.5,
  },
  lrn: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2ecc40',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  profileBtn: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 8,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  profileIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2ecc40',
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '92%',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#222',
    marginRight: 8,
    letterSpacing: 0.2,
  },
  greenDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#2ecc40',
  },
  announcementScroll: {
    width: '100%',
    marginBottom: 18,
    minHeight: 120,
  },
  announcementBox: {
    width: width * 0.8,
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    padding: 18,
    marginBottom: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  teacherAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#2ecc40',
  },
  teacherName: {
    fontWeight: 'bold',
    fontSize: 17,
    color: '#222',
  },
  teacherGrade: {
    fontSize: 14,
    color: '#666',
    marginTop: 1,
  },
  announcementTextScrollWrap: {
    maxHeight: 70,
    marginBottom: 2,
  },
  announcementTextScroll: {
    maxHeight: 70,
  },
  announcementText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
    lineHeight: 20,
    paddingRight: 2,
  },
  announcementDate: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 8,
    alignSelf: 'flex-end',
  },
  announcementTime: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 8,
    alignSelf: 'flex-end',
  },
  progressRowCardWrap: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    width: '92%',
    marginBottom: 16,
    gap: 12,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  progressCardSingle: {
    flex: 1,
    minWidth: 0,
    maxWidth: '48%',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 10,
    marginHorizontal: 0,
    marginBottom: 0,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  progressCol: {
    alignItems: 'center',
    flex: 1,
  },
  circleWrap: {
    alignItems: 'center',
    marginBottom: 2,
    shadowColor: '#2ecc40',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  circle: {
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 8,
    borderColor: '#2ecc40',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f7fafd',
    marginBottom: 2,
    shadowColor: '#2ecc40',
    shadowOpacity: 0.10,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  circleText: {
    fontSize: 22,
    fontWeight: 'bold',
  },
  progressLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#222',
    marginTop: 2,
  },
  progressScore: {
    fontSize: 13,
    color: '#888',
    marginTop: 1,
    marginBottom: 4,
  },
  tasksBox: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.82)',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 14,
    marginTop: 14,
    marginBottom: 18,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  tasksTitle: {
    fontSize: 25,
    fontWeight: '700',
    color: '#222',
    marginLeft: 4,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    backgroundColor: 'rgba(247,250,253,0.82)',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  taskNum: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 2,
  },
  taskNumGray: {
    backgroundColor: '#e6e6e6',
    borderColor: '#bbb',
  },
  taskNumDone: {
    backgroundColor: '#e6ffe6',
    borderColor: '#2ecc40',
  },
  taskNumText: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  taskNumTextGray: {
    color: '#bbb',
  },
  taskNumTextDone: {
    color: '#2ecc40',
  },
  taskStatus: {
    fontWeight: 'bold',
    fontSize: 13,
    marginLeft: 10,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDone: {
    color: '#2ecc40',
    backgroundColor: '#e6ffe6',
  },
  statusOngoing: {
    color: '#f1c40f',
    backgroundColor: '#fffbe6',
  },
  statusNotDone: {
    color: '#bbb',
    backgroundColor: '#f3f3f3',
  },
  taskTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
  },
  taskTitleSmall: {
    fontWeight: '600',
    color: '#222',
    fontSize: 14,
    flexShrink: 1,
    marginRight: 8,
  },
  taskDetails: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 2,
  },
  tasksTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
  },
  generalProgressWrap: {
    height: 8,
    flex: 1,
    backgroundColor: '#e6e6e6',
    borderRadius: 4,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  generalProgressBar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2ecc40',
  },
  generalProgressText: {
    fontSize: 13,
    color: '#888',
    minWidth: 40,
    textAlign: 'right',
    marginLeft: 0,
  },
  modalBlur: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCenterWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  modalAnnouncementBox: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.97)',
    borderRadius: 22,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'flex-start',
  },
  modalAnnouncementText: {
    fontSize: 16,
    color: '#222',
    marginTop: 10,
    lineHeight: 22,
    marginBottom: 8,
  },
  modalCloseBtn: {
    alignSelf: 'center',
    marginTop: 16,
    backgroundColor: '#2ecc40',
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 24,
  },
  modalCloseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
  changeBtn: {
    marginLeft: 10,
    padding: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(46,204,64,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonOption: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    marginBottom: 8,
  },
  reasonOptionSelected: {
    backgroundColor: '#e6ffe6',
    borderColor: '#2ecc40',
    borderWidth: 1.5,
  },
  reasonOptionText: {
    fontSize: 16,
    color: '#222',
  },
}); 