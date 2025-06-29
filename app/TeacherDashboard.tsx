import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions, ImageBackground, Modal, TextInput, Pressable, FlatList, Alert } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Svg, Path, G, Text as SvgText, Circle, Line } from 'react-native-svg';
import { LinearGradient } from 'expo-linear-gradient';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
const bgImage = require('../assets/images/bg.jpg');

const { width } = Dimensions.get('window');

interface Student {
  id: string;
  studentNumber: string;
  nickname: string;
  category: string;
}

interface ClassData {
  id: string;
  school: string;
  section: string;
  students: Student[];
  tasks: { title: string; details: string; status: string }[];
  learnersPerformance: { label: string; color: string; percent: number }[];
}

type ModalType = 'addClass' | 'addStudent' | 'announce' | 'category' | 'taskInfo' | 'classList' | 'startTest' | 'editStudent' | null;

export default function TeacherDashboard() {
  const teacherName = 'Teacher Ced';
  const [modalType, setModalType] = useState<ModalType>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [classSection, setClassSection] = useState('');
  const [classSchool, setClassSchool] = useState('');
  const [studentNickname, setStudentNickname] = useState('');
  const [announceText, setAnnounceText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [testType, setTestType] = useState<'pre' | 'post' | null>(null);
  const [selectedClassId, setSelectedClassId] = useState<string | null>(null);
  const [selectedPerformance, setSelectedPerformance] = useState<{ classId: string, idx: number } | null>(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [sortColumn, setSortColumn] = useState<'name' | 'status' | 'pre' | 'post'>('name');
  const [sortAsc, setSortAsc] = useState(true);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [editingStudentName, setEditingStudentName] = useState('');

  // Use theme-matching harmonious colors for the chart
  const defaultCategories = [
    { label: 'Intervention', color: '#ff5a5a' },      // red
    { label: 'Consolidation', color: '#ffb37b' },    // peach/orange
    { label: 'Enhancement', color: '#ffe066' },      // yellow
    { label: 'Proficient', color: '#7ed957' },       // light green
    { label: 'Highly Proficient', color: '#27ae60' },// main green
  ];

  // Update defaultClasses with realistic data, including highly proficient students
  const defaultClasses = [
    {
      id: '1',
      school: 'Camohaguin ES',
      section: 'ERM',
      students: [
        { id: '1', studentNumber: 'ERM-2025-001', nickname: 'Juan Dela Cruz', category: 'Intervention' },
        { id: '2', studentNumber: 'ERM-2025-002', nickname: 'Maria Santos', category: 'Consolidation' },
        { id: '3', studentNumber: 'ERM-2025-003', nickname: 'Pedro Reyes', category: 'Enhancement' },
        { id: '4', studentNumber: 'ERM-2025-004', nickname: 'Ana Garcia', category: 'Proficient' },
        { id: '5', studentNumber: 'ERM-2025-005', nickname: 'Luis Martinez', category: 'Highly Proficient' },
        { id: '6', studentNumber: 'ERM-2025-006', nickname: 'Carmen Lopez', category: 'Highly Proficient' },
        { id: '7', studentNumber: 'ERM-2025-007', nickname: 'Roberto Torres', category: 'Enhancement' },
        { id: '8', studentNumber: 'ERM-2025-008', nickname: 'Isabel Flores', category: 'Proficient' },
        { id: '9', studentNumber: 'ERM-2025-009', nickname: 'Jessa Lim', category: 'Highly Proficient' },
      ],
      tasks: [
        { title: 'Intervention', details: 'Remedial reading session', status: 'done' },
        { title: 'Consolidation', details: 'Math group activity', status: 'ongoing' },
        { title: 'Enhancement', details: 'Science project', status: 'done' },
        { title: 'Proficient', details: 'Essay writing', status: 'done' },
        { title: 'Highly Proficient', details: 'Quiz bee', status: 'done' },
      ],
      learnersPerformance: [
        { label: 'Intervention', color: '#ff5a5a', percent: 11 },
        { label: 'Consolidation', color: '#ffb37b', percent: 11 },
        { label: 'Enhancement', color: '#ffe066', percent: 22 },
        { label: 'Proficient', color: '#7ed957', percent: 22 },
        { label: 'Highly Proficient', color: '#27ae60', percent: 34 },
      ],
    },
    {
      id: '2',
      school: 'San Isidro ES',
      section: 'CAS',
      students: [
        { id: '1', studentNumber: 'CAS-2025-001', nickname: 'Mark Cruz', category: 'Intervention' },
        { id: '2', studentNumber: 'CAS-2025-002', nickname: 'Liza Sison', category: 'Consolidation' },
        { id: '3', studentNumber: 'CAS-2025-003', nickname: 'Jomar Dela Peña', category: 'Enhancement' },
        { id: '4', studentNumber: 'CAS-2025-004', nickname: 'Mia Santos', category: 'Proficient' },
        { id: '5', studentNumber: 'CAS-2025-005', nickname: 'Ella Ramos', category: 'Highly Proficient' },
        { id: '6', studentNumber: 'CAS-2025-006', nickname: 'Nico Lim', category: 'Highly Proficient' },
        { id: '7', studentNumber: 'CAS-2025-007', nickname: 'Rhea Tan', category: 'Enhancement' },
        { id: '8', studentNumber: 'CAS-2025-008', nickname: 'Paolo Go', category: 'Proficient' },
        { id: '9', studentNumber: 'CAS-2025-009', nickname: 'Janelle Uy', category: 'Highly Proficient' },
      ],
      tasks: [
        { title: 'Intervention', details: 'Phonics drill', status: 'done' },
        { title: 'Consolidation', details: 'Group recitation', status: 'done' },
        { title: 'Enhancement', details: 'Art contest', status: 'ongoing' },
        { title: 'Proficient', details: 'Quiz bee', status: 'done' },
        { title: 'Highly Proficient', details: 'Debate', status: 'done' },
      ],
      learnersPerformance: [
        { label: 'Intervention', color: '#ff5a5a', percent: 11 },
        { label: 'Consolidation', color: '#ffb37b', percent: 11 },
        { label: 'Enhancement', color: '#ffe066', percent: 22 },
        { label: 'Proficient', color: '#7ed957', percent: 22 },
        { label: 'Highly Proficient', color: '#27ae60', percent: 34 },
      ],
    },
  ];

  const [classes, setClasses] = useState<ClassData[]>(defaultClasses);

  // Helper to get a class by id
  const getClassById = (id: string | null) => classes.find(cls => cls.id === id) || null;

  // Modal open/close helpers
  const openModal = (type: ModalType, extra: any = null) => {
    setModalType(type);
    if (type === 'category') {
      setSelectedCategory(extra?.category);
      setSelectedClassId(extra?.classId);
    }
    if (type === 'addStudent') {
      setSelectedClassId(extra?.classId);
    }
    if (type === 'classList') {
      setSelectedClassId(extra?.classId);
    }
    if (type === 'startTest') {
      setSelectedStudent(extra.student);
      setTestType(extra.testType);
      setSelectedClassId(extra.classId);
    }
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setModalType(null);
    setClassSection('');
    setClassSchool('');
    setStudentNickname('');
    setAnnounceText('');
    setSelectedCategory(null);
    setSelectedStudent(null);
    setTestType(null);
    setSelectedClassId(null);
    setEditingStudent(null);
    setEditingStudentName('');
  };

  // Add new class
  const addClass = () => {
    if (classSection.trim()) {
      const newClass: ClassData = {
        id: Date.now().toString(),
        school: classSchool.trim() || 'Unknown School',
        section: classSection.trim(),
        students: [],
        tasks: [
          { title: 'Intervention', details: 'Lorem ipsum dolor sit amet, consectetur', status: 'pending' },
          { title: 'Consolidation', details: 'Lorem ipsum dolor sit amet, consectetur', status: 'pending' },
          { title: 'Enhancement', details: 'Lorem ipsum dolor sit amet, consectetur', status: 'pending' },
          { title: 'Proficient', details: 'Lorem ipsum dolor sit amet, consectetur', status: 'pending' },
          { title: 'Highly Proficient', details: 'Lorem ipsum dolor sit amet, consectetur', status: 'pending' },
        ],
        learnersPerformance: [
          { label: 'Intervention', color: '#ff5a5a', percent: 20 },
          { label: 'Consolidation', color: '#ffb37b', percent: 20 },
          { label: 'Enhancement', color: '#ffe066', percent: 20 },
          { label: 'Proficient', color: '#7ed957', percent: 20 },
          { label: 'Highly Proficient', color: '#27ae60', percent: 20 },
        ],
      };
      setClasses(prev => [...prev, newClass]);
      closeModal();
    }
  };

  // Add new student to a class
  const addStudent = () => {
    if (selectedClassId) {
      setClasses(prev => prev.map(cls => {
        if (cls.id !== selectedClassId) return cls;
        const nextNum = cls.students.length + 1;
        const studentNumber = `${cls.section}-2025-${String(nextNum).padStart(3, '0')}`;
        const newStudent: Student = {
          id: Date.now().toString(),
          studentNumber,
          nickname: studentNickname.trim() || studentNumber,
          category: 'Intervention',
        };
        return { ...cls, students: [...cls.students, newStudent] };
      }));
      closeModal();
    }
  };

  // Start test function
  const startTest = () => {
    if (selectedStudent && testType) {
      // Here you would navigate to the test screen
      console.log(`Starting ${testType}-test for ${selectedStudent.nickname}`);
      closeModal();
    }
  };

  // Edit student function
  const editStudent = () => {
    if (editingStudent && editingStudentName.trim() && selectedClassId) {
      setClasses(prev => prev.map(cls => {
        if (cls.id !== selectedClassId) return cls;
        return {
          ...cls,
          students: cls.students.map(student =>
            student.id === editingStudent.id
              ? { ...student, nickname: editingStudentName.trim() }
              : student
          )
        };
      }));
      closeModal();
    }
  };

  // Render student item for the list
  const renderStudentItem = (classId: string) => ({ item }: { item: Student }) => {
    const handleDeleteStudent = () => {
      Alert.alert('Delete Student', `Are you sure you want to delete ${item.nickname}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setClasses(prev => prev.map(cls =>
            cls.id === classId
              ? { ...cls, students: cls.students.filter(s => s.id !== item.id) }
              : cls
          ));
        } },
      ]);
    };
    return (
      <View style={styles.studentItem}>
        <View style={styles.studentInfo}>
          <Text style={styles.studentNickname}>{item.nickname}</Text>
          <Text style={styles.studentNumber}>{item.studentNumber}</Text>
        </View>
        <View style={styles.testButtons}>
          <TouchableOpacity 
            style={[styles.testButton, styles.preTestButton]} 
            onPress={() => openModal('startTest', { student: item, testType: 'pre', classId })}
          >
            <Text style={styles.testButtonText}>Pre-test</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.testButton, styles.postTestButton]} 
            onPress={() => openModal('startTest', { student: item, testType: 'post', classId })}
          >
            <Text style={styles.testButtonText}>Post-test</Text>
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 8, backgroundColor: '#ff5a5a', borderRadius: 8, padding: 6 }} onPress={handleDeleteStudent}>
            <MaterialIcons name="delete" size={18} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // Analytics calculations
  const totalClasses = classes.length;
  const totalStudents = classes.reduce((sum, c) => sum + c.students.length, 0);
  const allPerformance = classes.flatMap(c => c.learnersPerformance.map(lp => lp.percent));
  const avgPerformance = allPerformance.length ? Math.round(allPerformance.reduce((a, b) => a + b, 0) / allPerformance.length) : 0;
  const mostImprovedGroup = (() => {
    // For demo, just pick the group with the highest percent in the first class
    if (!classes[0]) return 'N/A';
    return classes[0].learnersPerformance.reduce((a, b) => (a.percent > b.percent ? a : b)).label;
  })();

  // Modern, 3D/gradient, adaptive analytics cards
  function AnalyticsCards() {
    return (
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 2, gap: 4, flexWrap: 'wrap' }}>
        <LinearGradient colors={['#e0ffe6', '#c6f7e2']} style={styles.analyticsCard}>
          <AntDesign name="appstore1" size={32} color="#27ae60" style={styles.analyticsIcon} />
          <Text style={styles.analyticsValue}>{totalClasses}</Text>
          <Text style={styles.analyticsLabel}>Total{'\n'}Classes</Text>
        </LinearGradient>
        <LinearGradient colors={['#e0f7fa', '#b2ebf2']} style={styles.analyticsCard}>
          <MaterialCommunityIcons name="account-group" size={32} color="#0097a7" style={styles.analyticsIcon} />
          <Text style={styles.analyticsValue}>{totalStudents}</Text>
          <Text style={styles.analyticsLabel}>Total{'\n'}Students</Text>
        </LinearGradient>
        <LinearGradient colors={['#fffde4', '#ffe066']} style={styles.analyticsCard}>
          <AntDesign name="piechart" size={32} color="#ffb300" style={styles.analyticsIcon} />
          <Text style={styles.analyticsValue}>{avgPerformance}%</Text>
          <Text style={styles.analyticsLabel}>Average{'\n'}Performance</Text>
        </LinearGradient>
      </View>
    );
  }

  // Modern student count card with icon and number
  function StudentCountCard({ count, iconSize = 24, fontSize = 18 }: { count: number, iconSize?: number, fontSize?: number }) {
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#e0f7fa',
        borderRadius: 12,
        paddingVertical: 4,
        paddingHorizontal: 8,
        marginTop: 2,
        marginRight: 0,
        marginBottom: 4,
        minWidth: 40,
        justifyContent: 'center',
      }}>
        <MaterialCommunityIcons name="account-group" size={iconSize} color="#0097a7" style={{ marginRight: 4 }} />
        <Text style={{ fontSize, fontWeight: 'bold', color: '#0097a7' }}>{count}</Text>
      </View>
    );
  }

  // Responsive pie chart with legend always side by side
  function AnalyticsPieChartWithLegend({ data, reverse = false, title = 'Pretest Performance' }: { data: { label: string; color: string; percent: number }[], reverse?: boolean, title?: string }) {
    const windowWidth = Dimensions.get('window').width;
    // Container width: full width minus 32px margin
    const containerWidth = Math.max(240, windowWidth - 60);
    // Pie chart size: 48% of container, min 100, max 180
    const size = Math.max(100, Math.min(containerWidth * 0.44, 180));
    const radius = size / 2 - 8;
    const center = size / 2;
    // Font and dot sizes
    const fontSizeTitle = windowWidth < 500 ? 18 : 22;
    const fontSizeLabel = windowWidth < 500 ? 13 : 15;
    const fontSizePercent = windowWidth < 500 ? 12 : 14;
    const dotSize = windowWidth < 500 ? 14 : 18;
    // Pie data
    const categories = defaultCategories.map(cat => {
      const found = data.find(d => d.label === cat.label);
      return found ? found : { ...cat, percent: 0 };
    });
    const total = categories.reduce((sum, d) => sum + d.percent, 0) || 1;
    let startAngle = 0;
    const arcs = categories.map((d, idx) => {
      const angle = (d.percent / total) * 2 * Math.PI;
      const endAngle = startAngle + angle;
      const largeArc = angle > Math.PI ? 1 : 0;
      const x1 = center + radius * Math.cos(startAngle);
      const y1 = center + radius * Math.sin(startAngle);
      const x2 = center + radius * Math.cos(endAngle);
      const y2 = center + radius * Math.sin(endAngle);
      const path = [
        `M ${center} ${center}`,
        `L ${x1} ${y1}`,
        `A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`,
        'Z',
      ].join(' ');
      startAngle = endAngle;
      return { path, color: d.color, label: d.label, percent: d.percent, idx };
    });
    // Responsive layout: chart and legend in 2-column row
    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: containerWidth,
        marginBottom: 24,
        paddingHorizontal: 8,
        paddingVertical: 12,
        alignSelf: 'center',
        backgroundColor: 'rgba(255,255,255,0.92)',
        borderRadius: 18,
        gap: 0,
      }}>
        {reverse ? (
          <>
            <View style={{ flex: 1, minWidth: 120, alignItems: 'flex-end', justifyContent: 'center', marginRight: 0, paddingRight: 0, gap: 8 }}>
              {arcs.map((arc) => (
                <View key={arc.label + '-' + arc.percent + '-' + arc.idx} style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 10, marginTop: 2 }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: arc.color, marginLeft: 8, borderWidth: 1, borderColor: '#eee' }} />
                  <Text style={{ fontSize: fontSizeLabel, color: '#222', fontWeight: '600', marginLeft: 4 }}>{arc.label}</Text>
                  <Text style={{ fontSize: fontSizePercent, color: '#888', fontWeight: '500' }}>({arc.percent}%)</Text> 
                </View>
              ))}
            </View>
            <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: size, maxWidth: size, marginLeft: 4 }}>
              <Text style={{ fontSize: fontSizeTitle, fontWeight: 'bold', color: '#222', marginBottom: 0, textAlign: 'center' }}>{title}</Text>
              <Svg width={size} height={size} style={{ marginBottom: -6 }}>
                <G>
                  {arcs.map((arc) => (
                    <Path key={arc.label + '-' + arc.percent + '-' + arc.idx} d={arc.path} fill={arc.color} />
                  ))}
                </G>
              </Svg>
            </View>
          </>
        ) : (
          <>
            <View style={{ alignItems: 'center', justifyContent: 'center', minWidth: size, maxWidth: size, marginRight: 4 }}>
              <Text style={{ fontSize: fontSizeTitle, fontWeight: 'bold', color: '#222', marginBottom: 0, textAlign: 'center' }}>{title}</Text>
              <Svg width={size} height={size} style={{ marginBottom: -6 }}>
                <G>
                  {arcs.map((arc) => (
                    <Path key={arc.label + '-' + arc.percent + '-' + arc.idx} d={arc.path} fill={arc.color} />
                  ))}
                </G>
              </Svg>
            </View>
            <View style={{ flex: 1, minWidth: 120, alignItems: 'flex-start', justifyContent: 'center', marginLeft: 0, paddingLeft: 0, gap: 8 }}>
              {arcs.map((arc) => (
                <View key={arc.label + '-' + arc.percent + '-' + arc.idx} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10, marginTop: 2 }}>
                  <View style={{ width: dotSize, height: dotSize, borderRadius: dotSize / 2, backgroundColor: arc.color, marginRight: 8, borderWidth: 1, borderColor: '#eee' }} />
                  <Text style={{ fontSize: fontSizeLabel, color: '#222', fontWeight: '600', marginRight: 4 }}>{arc.label}</Text>
                  <Text style={{ fontSize: fontSizePercent, color: '#888', fontWeight: '500' }}>({arc.percent}%)</Text> 
                </View>
              ))}
            </View>
          </>
        )}
      </View>
    );
  }

  // Refactor Tasks Progress to a 2-column grid of modern cards
  const categoryRanges = {
    'Intervention': 'Total Score < 25%',
    'Consolidation': '25-49%',
    'Enhancement': '50-74%',
    'Proficient': '75-84%',
    'Highly Proficient': '85-100%',
  };

  function TasksProgressGrid({ categories, tasks }: { categories: { label: string; color: string }[], tasks: { title: string; details: string; status: string }[] }) {
    // Count status for progress bar
    const total = tasks.length;
    const done = tasks.filter(t => t.status === 'done').length;
    const ongoing = tasks.filter(t => t.status === 'ongoing').length;
    const notDone = total - done - ongoing;
    return (
      <View style={{ width: '100%' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 22, fontWeight: 'bold', color: '#222', marginRight: 8 }}>Tasks Progress</Text>
          <MaterialIcons name="info" size={18} color="#27ae60" style={{ marginLeft: 4 }} />
          <View style={{ flex: 1, height: 8, backgroundColor: '#e6e6e6', borderRadius: 4, marginHorizontal: 10, flexDirection: 'row', overflow: 'hidden' }}>
            <View style={{ height: 8, backgroundColor: '#7ed957', width: `${(done / total) * 100}%` }} />
            <View style={{ height: 8, backgroundColor: '#ffe066', width: `${(ongoing / total) * 100}%` }} />
            <View style={{ height: 8, backgroundColor: '#ff5a5a', width: `${(notDone / total) * 100}%` }} />
          </View>
          <Text style={{ fontSize: 15, color: '#222', fontWeight: 'bold', minWidth: 60, textAlign: 'right' }}>Progress <Text style={{ fontWeight: 'bold' }}>{Math.round((done / total) * 100)}%</Text></Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 8, gap: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#7ed957', borderRadius: 6, marginRight: 4 }} />
            <Text style={{ fontSize: 13, color: '#222' }}>Done</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#ffe066', borderRadius: 6, marginRight: 4 }} />
            <Text style={{ fontSize: 13, color: '#222' }}>Ongoing</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, backgroundColor: '#ff5a5a', borderRadius: 6, marginRight: 4 }} />
            <Text style={{ fontSize: 13, color: '#222' }}>Not Yet Done</Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 10 }}>
          {categories.map((cat, idx) => (
            <View
              key={cat.label}
              style={{
                backgroundColor: '#fff',
                borderRadius: 16,
                paddingVertical: 18,
                paddingHorizontal: 18,
                marginBottom: 12,
                width: '48%',
                minWidth: 150,
                maxWidth: '48%',
                shadowColor: '#27ae60',
                shadowOpacity: 0.08,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 16, marginBottom: 2 }}>For {cat.label}</Text>
                <Text style={{ color: '#888', fontSize: 14 }}>{categoryRanges[cat.label as keyof typeof categoryRanges]}</Text>
              </View>
              <TouchableOpacity style={{ backgroundColor: '#e6ffe6', borderRadius: 18, padding: 8, marginLeft: 8 }}>
                <MaterialIcons name="arrow-forward-ios" size={22} color="#27ae60" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </View>
    );
  }

  // Add a style for the main dashboard card
  const dashboardCardStyle = {
    width: Dimensions.get('window').width,
    maxWidth: 600,
    backgroundColor: 'rgba(255,255,255,0.92)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 12,
    marginBottom: 24,
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  };

  // Render each class panel
  const renderClassPanel = (cls: ClassData) => {
    // Group students by category
    const studentsByCategory: Record<string, Student[]> = {};
    cls.students.forEach(student => {
      if (!studentsByCategory[student.category]) studentsByCategory[student.category] = [];
      studentsByCategory[student.category].push(student);
    });
    // Delete class handler
    const handleDeleteClass = () => {
      Alert.alert('Delete Class', `Are you sure you want to delete class ${cls.section}?`, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => {
          setClasses(prev => prev.filter(c => c.id !== cls.id));
        } },
      ]);
    };
    const windowWidth = Dimensions.get('window').width;
    const isSmall = windowWidth < 400;
    return (
      <LinearGradient colors={['#f7fafc', '#e0f7fa']} style={[styles.classCard, { marginBottom: 15, padding: 2, borderRadius: 32, shadowColor: '#27ae60', shadowOpacity: 0.13, shadowRadius: 18, shadowOffset: { width: 0, height: 8 }, elevation: 10, width: '100%', maxWidth: 540, alignSelf: 'center' }]}> 
        <View style={{ padding: isSmall ? 16 : 24, paddingBottom: isSmall ? 0 : 8 }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: isSmall ? 9 : 8 }}>
            <View>
              <Text style={{ fontSize: 12, color: '#888', fontWeight: '700', marginBottom: -3 }}>{cls.school}</Text>
              <Text style={{ fontSize: 35, color: '#27ae60', fontWeight: 'bold', letterSpacing: 1 }}>{cls.section}</Text>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', marginBottom: isSmall ? 10 : 18, gap: 6, flexWrap: 'wrap', alignSelf: 'flex-end' }}>
              <TouchableOpacity onPress={() => openModal('classList', { classId: cls.id })} activeOpacity={0.8} style={{ borderRadius: 20, overflow: 'hidden', maxWidth: 48, minWidth: 0, marginHorizontal: 1 }}>
                <StudentCountCard count={cls.students.length} iconSize={22} fontSize={16} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal('addStudent', { classId: cls.id })} style={{ backgroundColor: '#e0f7fa', borderRadius: 20, padding: 6, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#0097a7', shadowOpacity: 0.10, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, maxWidth: 48, minWidth: 0, marginHorizontal: 1 }}>
                <MaterialIcons name="person-add" size={22} color="#0097a7" />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => openModal('announce', { classId: cls.id })} style={{ backgroundColor: '#0097a7', borderRadius: 20, padding: 6, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#0097a7', shadowOpacity: 0.10, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, maxWidth: 48, minWidth: 0, marginHorizontal: 1 }}>
                <MaterialIcons name="campaign" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteClass} style={{ backgroundColor: '#ffeaea', borderRadius: 20, padding: 6, alignItems: 'center', justifyContent: 'center', elevation: 2, shadowColor: '#ff5a5a', shadowOpacity: 0.10, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, maxWidth: 48, minWidth: 0, marginHorizontal: 1 }}>
                <MaterialIcons name="delete" size={22} color="#ff5a5a" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ marginTop: isSmall ? 8 : 16 }}>
            <AnalyticsPieChartWithLegend data={cls.learnersPerformance} title="Pretest Performance" />
            <View style={{ height: 10 }} />
            <AnalyticsPieChartWithLegend data={cls.learnersPerformance} reverse title="Posttest Performance" />
          </View>
        </View>
      </LinearGradient>
    );
  };

  // Modal content renderers (update to use selectedClassId)
  const renderModalContent = (): React.JSX.Element | null => {
    const cls = getClassById(selectedClassId);
    switch (modalType) {
      case 'addClass':
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Classroom</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Section (e.g. JDC)"
              value={classSection}
              onChangeText={setClassSection}
            />
            <TextInput
              style={styles.modalInput}
              placeholder="School (optional)"
              value={classSchool}
              onChangeText={setClassSchool}
            />
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={closeModal}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={addClass}><Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Add</Text></Pressable>
            </View>
          </View>
        );
      case 'addStudent':
        if (!cls) return null;
        const nextStudentNumber = `${cls.section}-2025-${String(cls.students.length + 1).padStart(3, '0')}`;
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Add Student</Text>
            <TextInput
              style={[styles.modalInput, { color: '#888' }]}
              value={nextStudentNumber}
              editable={false}
              selectTextOnFocus={false}
            />
            <Text style={styles.modalNote}>
              Student number is generated automatically. This is NOT the official DepEd LRN.
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Student Nickname (optional)"
              value={studentNickname}
              onChangeText={setStudentNickname}
            />
            <Text style={styles.modalNote}>
              Nickname can be the student's full name or any identifier you prefer. If left blank, student number will be used.
            </Text>
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={closeModal}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={addStudent}><Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Add</Text></Pressable>
            </View>
          </View>
        );
      case 'classList':
        if (!cls) return null;
        // Updated status order and color mapping
        const statusOrder = {
          'Not yet taken': 0,
          'Intervention': 1,
          'For Consolidation': 2,
          'For Enhancement': 3,
          'Proficient': 4,
          'Highly Proficient': 5
        };
        const statusColors: Record<string, string> = {
          'Not yet taken': '#888',
          'Intervention': '#ff5a5a',
          'For Consolidation': '#ffb37b',
          'For Enhancement': '#ffe066',
          'Proficient': '#7ed957',
          'Highly Proficient': '#27ae60',
        };
        // Helper to get status from score
        function getStatusFromScore(score: number, total: number) {
          if (typeof score !== 'number' || typeof total !== 'number' || total === 0) return 'Not yet taken';
          const percent = (score / total) * 100;
          if (percent < 25) return 'Intervention';
          if (percent < 50) return 'For Consolidation';
          if (percent < 75) return 'For Enhancement';
          if (percent < 85) return 'Proficient';
          return 'Highly Proficient';
        }
        // Realistic demo: some students have only pre, some both, none post without pre
        const demoStudentScores: Record<string, { pre?: number; post?: number }> = {
          // id: { pre, post }
          '1': { pre: 2, post: 8 }, // Highly Proficient
          '2': { pre: 3, post: 4 }, // For Consolidation
          '3': { pre: 6, post: 7 }, // Proficient
          '4': { pre: 1 }, // Only pre, Intervention
          '5': { pre: 7, post: 9 }, // Highly Proficient
          '6': { pre: 4, post: 5 }, // For Enhancement
          '7': { pre: 0 }, // Only pre, Intervention
          '8': { pre: 5, post: 6 }, // For Enhancement
          '9': { pre: 8, post: 8 }, // Highly Proficient
        };
        const getStudentTestStatus = (student: Student, type: 'pre' | 'post') => {
          const scores = demoStudentScores[student.id] || {};
          if (type === 'pre') {
            if (typeof scores.pre === 'number') {
              return {
                taken: true,
                score: scores.pre,
                total: 10,
                category: getStatusFromScore(scores.pre, 10),
              };
            } else {
              return { taken: false, category: 'Not yet taken' };
            }
          } else {
            // Only allow post if pre exists
            if (typeof scores.pre === 'number' && typeof scores.post === 'number') {
              return {
                taken: true,
                score: scores.post,
                total: 10,
                category: getStatusFromScore(scores.post, 10),
              };
            } else {
              return { taken: false, category: 'Not yet taken' };
            }
          }
        };
        function getStudentStatusForSort(student: Student) {
          const postStatus = getStudentTestStatus(student, 'post');
          if (!postStatus.taken || !postStatus.category || !(postStatus.category in statusOrder)) return 'Not yet taken';
          return postStatus.category;
        }
        let sortedStudents = [...cls.students];
        if (sortColumn === 'name') {
          sortedStudents.sort((a, b) => sortAsc ? a.nickname.localeCompare(b.nickname) : b.nickname.localeCompare(a.nickname));
        } else if (sortColumn === 'status') {
          sortedStudents.sort((a, b) => {
            const aOrder = statusOrder[getStudentStatusForSort(a) as keyof typeof statusOrder] ?? 0;
            const bOrder = statusOrder[getStudentStatusForSort(b) as keyof typeof statusOrder] ?? 0;
            return sortAsc ? aOrder - bOrder : bOrder - aOrder;
          });
        } else if (sortColumn === 'pre') {
          sortedStudents.sort((a, b) => {
            const aStatus = getStudentTestStatus(a, 'pre');
            const bStatus = getStudentTestStatus(b, 'pre');
            const aScore = aStatus.taken ? (aStatus.score || 0) : -1;
            const bScore = bStatus.taken ? (bStatus.score || 0) : -1;
            return sortAsc ? aScore - bScore : bScore - aScore;
          });
        } else if (sortColumn === 'post') {
          sortedStudents.sort((a, b) => {
            const aStatus = getStudentTestStatus(a, 'post');
            const bStatus = getStudentTestStatus(b, 'post');
            const aScore = aStatus.taken ? (aStatus.score || 0) : -1;
            const bScore = bStatus.taken ? (bStatus.score || 0) : -1;
            return sortAsc ? aScore - bScore : bScore - aScore;
          });
        }
        // Header click handler
        const handleSort = (col: 'name' | 'status' | 'pre' | 'post') => {
          if (sortColumn === col) {
            setSortAsc(!sortAsc);
          } else {
            setSortColumn(col);
            setSortAsc(true);
          }
        };
        return (
          <View style={[styles.modalBox, { backgroundColor: 'rgba(255,255,255,0.98)' }]}>
            <Text style={[styles.modalTitle, { marginBottom: 8 }]}>Class List</Text>
            {/* Column header row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8, minWidth: 340 }}>
              <TouchableOpacity style={{ flex: 1, minWidth: 90 }} onPress={() => handleSort('name')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13 }}>Name</Text>
                  {sortColumn === 'name' ? (
                    <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13, marginLeft: 2 }}>{sortAsc ? '\u25B2' : '\u25BC'}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ minWidth: 90, alignItems: 'center' }} onPress={() => handleSort('pre')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13 }}>Pre-test</Text>
                  {sortColumn === 'pre' ? (
                    <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13, marginLeft: 2 }}>{sortAsc ? '\u25B2' : '\u25BC'}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ minWidth: 90, alignItems: 'center' }} onPress={() => handleSort('post')}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13 }}>Post-test</Text>
                  {sortColumn === 'post' ? (
                    <Text style={{ fontWeight: 'bold', color: '#222', fontSize: 13, marginLeft: 2 }}>{sortAsc ? '\u25B2' : '\u25BC'}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
              <View style={{ width: 80 }} />
            </View>
            <ScrollView horizontal style={{ maxWidth: '100%' }} contentContainerStyle={{ minWidth: 340 }}>
            <FlatList
                data={sortedStudents}
              keyExtractor={item => item.id}
                style={{ marginVertical: 10, maxHeight: 400, minWidth: 340 }}
                renderItem={({ item }) => {
                  const preStatus = getStudentTestStatus(item, 'pre');
                  const postStatus = getStudentTestStatus(item, 'post');
                  return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, marginBottom: 14, padding: 14, minWidth: 340, gap: 10, elevation: 2, shadowColor: '#27ae60', shadowOpacity: 0.08, shadowRadius: 6, shadowOffset: { width: 0, height: 2 } }}>
                      <View style={{ flex: 1, minWidth: 90 }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 16, color: '#222', marginBottom: 2 }}>{item.nickname}</Text>
                        <Text style={{ color: '#888', fontSize: 13 }}>{item.studentNumber}</Text>
                      </View>
                      {/* Pre-test button/status */}
                      {preStatus.taken ? (
                        <View style={{ alignItems: 'center', marginRight: 4, minWidth: 90 }}>
                          <TouchableOpacity
                            style={{ backgroundColor: '#e0f7fa', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, minWidth: 90, alignItems: 'center' }}
                            onLongPress={() => {/* Add retake logic here */}}
                          >
                            <Text style={{ color: '#0097a7', fontWeight: 'bold', fontSize: 12 }}>Pre: {preStatus.score}/{preStatus.total}</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 10, color: statusColors[preStatus.category ?? ''] || '#888', marginTop: 2, fontWeight: '600' }}>{preStatus.category}</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{ backgroundColor: '#ff5a5a', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, minWidth: 90, alignItems: 'center', marginRight: 4 }}
                          onPress={() => openModal('startTest', { student: item, testType: 'pre', classId: cls.id })}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Pre-test</Text>
                        </TouchableOpacity>
                      )}
                      {/* Post-test button/status */}
                      {postStatus.taken ? (
                        <View style={{ alignItems: 'center', marginRight: 4, minWidth: 90 }}>
                          <TouchableOpacity
                            style={{ backgroundColor: '#e0f7fa', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, minWidth: 90, alignItems: 'center' }}
                            onLongPress={() => {/* Add retake logic here */}}
                          >
                            <Text style={{ color: '#0097a7', fontWeight: 'bold', fontSize: 12 }}>Post: {postStatus.score}/{postStatus.total}</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 10, color: statusColors[postStatus.category ?? ''] || '#888', marginTop: 2, fontWeight: '600' }}>{postStatus.category}</Text>
                        </View>
                      ) : (
                        <TouchableOpacity
                          style={{ backgroundColor: '#ffb37b', borderRadius: 8, paddingVertical: 6, paddingHorizontal: 12, minWidth: 90, alignItems: 'center', marginRight: 4 }}
                          onPress={() => openModal('startTest', { student: item, testType: 'post', classId: cls.id })}
                        >
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 12 }}>Post-test</Text>
                        </TouchableOpacity>
                      )}
                      {/* Edit button */}
                      <TouchableOpacity style={{ backgroundColor: '#0a7ea4', borderRadius: 8, padding: 6, marginRight: 4 }} onPress={() => {
                        setEditingStudent(item);
                        setEditingStudentName(item.nickname);
                        openModal('editStudent');
                      }}>
                        <MaterialIcons name="edit" size={18} color="#fff" />
                      </TouchableOpacity>
                      {/* Delete button */}
                      <TouchableOpacity style={{ backgroundColor: '#ff5a5a', borderRadius: 8, padding: 6 }} onPress={() => {
                        Alert.alert('Delete Student', `Are you sure you want to delete ${item.nickname}?`, [
                          { text: 'Cancel', style: 'cancel' },
                          { text: 'Delete', style: 'destructive', onPress: () => {
                            setClasses(prev => prev.map(cls2 =>
                              cls2.id === cls.id
                                ? { ...cls2, students: cls2.students.filter(s => s.id !== item.id) }
                                : cls2
                            ));
                          } },
                        ]);
                      }}>
                        <MaterialIcons name="delete" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                }}
              />
            </ScrollView>
            <Pressable style={[styles.modalBtn, { alignSelf: 'center', marginTop: 10 }]} onPress={closeModal}><Text style={styles.modalBtnText}>Close</Text></Pressable>
          </View>
        );
      case 'category':
        if (!cls || !selectedCategory) return null;
        const studentsInCategory = cls.students.filter(s => s.category === selectedCategory);
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>{selectedCategory} Students</Text>
            <FlatList
              data={studentsInCategory}
              keyExtractor={item => item.id}
              renderItem={renderStudentItem(cls.id)}
              style={{ marginVertical: 10, maxHeight: 300 }}
            />
            <Pressable style={[styles.modalBtn, { alignSelf: 'center', marginTop: 10 }]} onPress={closeModal}><Text style={styles.modalBtnText}>Close</Text></Pressable>
          </View>
        );
      case 'taskInfo':
        // Placeholder stats
        const taskStats = { done: 8, ongoing: 5, notdone: 12, total: 25 };
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Task Progress Details</Text>
            <Text style={styles.modalStat}>Done: <Text style={styles.modalStatNum}>{taskStats.done}</Text></Text>
            <Text style={styles.modalStat}>Ongoing: <Text style={styles.modalStatNum}>{taskStats.ongoing}</Text></Text>
            <Text style={styles.modalStat}>Not Done: <Text style={styles.modalStatNum}>{taskStats.notdone}</Text></Text>
            <Text style={styles.modalStat}>Total: <Text style={styles.modalStatNum}>{taskStats.total}</Text></Text>
            <Pressable style={[styles.modalBtn, { alignSelf: 'center', marginTop: 10 }]} onPress={closeModal}><Text style={styles.modalBtnText}>Close</Text></Pressable>
          </View>
        );
      case 'startTest':
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Start {testType === 'pre' ? 'Pre-test' : 'Post-test'}</Text>
            <Text style={styles.modalStat}>
              Student: <Text style={styles.modalStatNum}>{selectedStudent?.nickname}</Text>
            </Text>
            <Text style={styles.modalStat}>
              Number: <Text style={styles.modalStatNum}>{selectedStudent?.studentNumber}</Text>
            </Text>
            <Text style={styles.modalNote}>
              This will start the {testType === 'pre' ? 'pre-test' : 'post-test'} for {selectedStudent?.nickname}. 
              The student can take this test without their parent present.
            </Text>
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={closeModal}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={startTest}><Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Start Test</Text></Pressable>
            </View>
          </View>
        );
      case 'announce':
        const handleSendAnnouncement = () => {
          Alert.alert(
            'Send Announcement',
            'Are you sure you want to send this announcement to the parents of the class?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Send', style: 'destructive', onPress: () => closeModal() },
            ]
          );
        };
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Send Announcement</Text>
            <TextInput
              style={[styles.modalInput, { minHeight: 80, textAlignVertical: 'top' }]}
              placeholder="Type your announcement here..."
              value={announceText}
              onChangeText={setAnnounceText}
              multiline
              numberOfLines={4}
            />
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={closeModal}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={handleSendAnnouncement}><Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Send</Text></Pressable>
            </View>
          </View>
        );
      case 'editStudent':
        return (
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Edit Student</Text>
            <Text style={styles.modalStat}>
              Student Number: <Text style={styles.modalStatNum}>{editingStudent?.studentNumber}</Text>
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter new student name"
              value={editingStudentName}
              onChangeText={setEditingStudentName}
            />
            <View style={styles.modalBtnRow}>
              <Pressable style={styles.modalBtn} onPress={closeModal}><Text style={styles.modalBtnText}>Cancel</Text></Pressable>
              <Pressable style={[styles.modalBtn, styles.modalBtnPrimary]} onPress={editStudent}><Text style={[styles.modalBtnText, styles.modalBtnTextPrimary]}>Save</Text></Pressable>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  return (
    <ImageBackground source={bgImage} style={styles.bg} imageStyle={{ opacity: 0.13, resizeMode: 'cover' }}>
      <ScrollView contentContainerStyle={{ alignItems: 'center', paddingBottom: 32, paddingHorizontal: 0, width: '100%' }}>
        <View style={{ width: '100%', maxWidth: 600, marginTop: 0 }}>
        <View style={styles.headerWrap}>
          <View style={styles.headerRow}>
            <View>
              <Text style={styles.welcome}>Welcome,</Text>
                <Text style={styles.teacherName}>{teacherName}</Text>
            </View>
            <TouchableOpacity style={styles.profileBtn}>
              <FontAwesome name="user-circle" size={38} color="#27ae60" />
            </TouchableOpacity>
          </View>
        </View>

          <View style={dashboardCardStyle}>
            {/* Title and Add Class in a single row */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 0, width: '100%' }}>
              <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#222', marginLeft: 8, letterSpacing: 1, textShadowColor: '#e0ffe6', textShadowRadius: 6 }}>Classrooms</Text>
              <TouchableOpacity style={{ backgroundColor: '#27ae60', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 18, shadowColor: '#27ae60', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, marginRight: 8 }} onPress={() => openModal('addClass')}>
                <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 14 }}>Add Class</Text>
            </TouchableOpacity>
          </View>
            {/* Add space before class cards */}
            <View style={{ height: 8 }} />
            <AnalyticsCards />
            {classes.map(cls => (
              <React.Fragment key={cls.id}>
                {renderClassPanel(cls)}
              </React.Fragment>
            ))}
            </View>
        </View>
      </ScrollView>
      {/* Modal for all actions */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          {renderModalContent()}
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: '#f7fafc',
  },
  headerWrap: {
    width: '100%',
    paddingTop: 28,
    paddingBottom: 16,
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    marginBottom: 18,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    borderBottomWidth: 0.5,
    borderColor: '#e6e6e6',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 24,
    marginTop: 0,
    marginBottom: 0,
  },
  welcome: {
    fontSize: 23,
    fontWeight: '600',
    color: '#222',
    letterSpacing: 0.5,
  },
  teacherName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#27ae60',
    marginTop: 2,
    letterSpacing: 0.5,
  },
  profileBtn: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    borderRadius: 24,
    padding: 8,
    elevation: 6,
    shadowColor: '#27ae60',
    shadowOpacity: 0.12,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  classCard: {
    width: '92%',
    backgroundColor: 'rgba(243,243,243,0.92)',
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  classCardTitle: {
    fontSize: 19,
    fontWeight: '700',
    color: '#222',
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 18,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#27ae60',
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  classInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  classSchool: {
    fontSize: 15,
    color: '#888',
    fontWeight: '600',
  },
  classSection: {
    fontSize: 23,
    color: '#27ae60',
    fontWeight: 'bold',
    marginTop: 2,
  },
  classTotal: {
    fontSize: 15,
    color: '#222',
    fontWeight: '600',
    marginBottom: 4,
  },
  addStudentBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 14,
    paddingVertical: 5,
    paddingHorizontal: 14,
    marginTop: 2,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  addStudentBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
    letterSpacing: 0.2,
  },
  performanceCard: {
    width: '92%',
    backgroundColor: '#e5e5e5', // light gray to match the image
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  performanceTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#27ae60',
  },
  announceBtn: {
    backgroundColor: '#27ae60',
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 16,
    marginLeft: 8,
    shadowColor: '#27ae60',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  announceBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
    letterSpacing: 0.2,
  },
  performanceLabel: {
    fontSize: 16,
    color: '#222',
    fontWeight: '600',
    marginTop: 12,
    marginBottom: 10,
  },
  tasksBox: {
    width: '92%',
    backgroundColor: 'rgba(255,255,255,0.90)',
    borderRadius: 22,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginTop: 18,
    marginBottom: 22,
    elevation: 4,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
  },
  tasksTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
    paddingRight: 0,
    paddingLeft: 0,
  },
  tasksTitle: {
    fontSize: 21,
    fontWeight: '800',
    color: '#222',
    marginLeft: 4,
    marginBottom: 4,
    letterSpacing: 0.2,
  },
  generalProgressWrap: {
    height: 10,
    flex: 1,
    backgroundColor: '#e6e6e6',
    borderRadius: 5,
    marginLeft: 12,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexShrink: 1,
  },
  generalProgressBar: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#27ae60',
  },
  generalProgressText: {
    fontSize: 14,
    color: '#888',
    minWidth: 40,
    textAlign: 'right',
    marginLeft: 0,
    fontWeight: '600',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: 'rgba(247,250,253,0.92)',
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 14,
    elevation: 2,
    shadowColor: '#27ae60',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  taskTitleSmall: {
    fontWeight: '700',
    color: '#222',
    fontSize: 15,
    flexShrink: 1,
    marginRight: 8,
  },
  taskDetails: {
    fontSize: 13,
    color: '#888',
    marginTop: 4,
    lineHeight: 18,
    marginBottom: 2,
    fontWeight: '500',
  },
  taskArrowBtn: {
    backgroundColor: '#e6ffe6',
    borderRadius: 18,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    width: '85%',
    backgroundColor: 'rgba(255,255,255,0.98)',
    borderRadius: 22,
    padding: 24,
    shadowColor: '#27ae60',
    shadowOpacity: 0.13,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    alignItems: 'stretch',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#27ae60',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalInput: {
    backgroundColor: '#f3f3f3',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    marginBottom: 14,
    color: '#222',
  },
  modalBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 6,
  },
  modalBtn: {
    backgroundColor: '#e6e6e6',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 22,
    marginLeft: 8,
  },
  modalBtnPrimary: {
    backgroundColor: '#27ae60',
  },
  modalBtnText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 15,
  },
  modalBtnTextPrimary: {
    color: '#fff',
  },
  modalListItem: {
    fontSize: 15,
    color: '#222',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  modalStat: {
    fontSize: 16,
    color: '#444',
    marginBottom: 4,
    fontWeight: '600',
  },
  modalStatNum: {
    color: '#27ae60',
    fontWeight: 'bold',
  },
  modalNote: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
    marginTop: -6,
    textAlign: 'left',
  },
  classListIconBtn: {
    marginLeft: 8,
    padding: 4,
    borderRadius: 16,
    backgroundColor: 'rgba(39,174,96,0.08)',
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(247,250,253,0.92)',
    borderRadius: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: '#27ae60',
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  studentInfo: {
    flex: 1,
  },
  studentNickname: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222',
    marginBottom: 2,
  },
  studentNumber: {
    fontSize: 13,
    color: '#888',
    fontWeight: '500',
  },
  testButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  testButton: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 12,
    minWidth: 70,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  testButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  preTestButton: {
    backgroundColor: '#ff5a5a',
  },
  postTestButton: {
    backgroundColor: '#ff9f43',
  },
  analyticsCard: {
    flex: 1,
    minWidth: 120,
    maxWidth: 160,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 18,
    paddingVertical: 8,
    marginBottom: 16,
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  analyticsIcon: {
    marginBottom: 6,
  },
  analyticsValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
    marginBottom: 2,
  },
  analyticsLabel: {
    fontSize: 13,
    color: '#444',
    fontWeight: '600',
    textAlign: 'center',
  },
  actionBtn: {
    flex: 1,
    borderRadius: 10,
    paddingVertical: 6,
    paddingHorizontal: 0,
    marginHorizontal: 4,
    minWidth: 90,
    maxWidth: 180,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#27ae60',
    shadowOpacity: 0.10,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
  },
  actionBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
    letterSpacing: 0.2,
  },
}); 