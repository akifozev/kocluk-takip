import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Student } from '../../types';
import {
  Users,
  UserPlus,
  Search,
  Target,
  Flame,
  Phone,
  Edit2,
  Trash2,
  MessageSquare,
  Calendar,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Avatar } from '../common/Avatar';

interface StudentsViewProps {
  onOpenStudentModal: (student?: Student) => void;
  onOpenMeetingModal: (student: Student) => void;
}

export const StudentsView: React.FC<StudentsViewProps> = ({
  onOpenStudentModal,
  onOpenMeetingModal
}) => {
  const {
    students,
    selectedStudentId,
    setSelectedStudentId,
    deleteStudent,
    meetings,
    deleteMeeting
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');

  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.targetDepartment.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'ALL' || s.examType === filterType;
    return matchesSearch && matchesType;
  });

  const selectedStudent = students.find((s) => s.id === selectedStudentId);
  const studentMeetings = meetings.filter((m) => m.studentId === selectedStudentId);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-indigo-600" />
            Öğrenci Yönetimi & Portföy
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Tüm danışan öğrencilerinizi, hedeflerini, veli iletişimlerini ve koçluk notlarını buradan yönetin.
          </p>
        </div>

        <button
          onClick={() => onOpenStudentModal()}
          className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm shadow-md shadow-indigo-200 transition active:scale-95 self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>Yeni Öğrenci Ekle</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="İsim veya hedef bölüm ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 rounded-xl border border-slate-200 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          {['ALL', 'YKS-SAY', 'YKS-EA', 'LGS', 'KPSS'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-xl font-bold transition whitespace-nowrap ${
                filterType === type
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {type === 'ALL' ? 'Tümü' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Student Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStudents.map((student) => {
          const isSelected = student.id === selectedStudentId;

          return (
            <div
              key={student.id}
              className={`bg-white rounded-3xl p-5 border transition-all duration-200 shadow-xs flex flex-col justify-between ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md'
                  : 'border-slate-200/90 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Header: Avatar, Name, Type */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <Avatar
                      name={student.name}
                      avatar={student.avatar}
                      size="lg"
                      className="ring-2 ring-slate-100 shadow-xs"
                    />
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                        {student.name}
                      </h3>
                      <div className="flex items-center gap-1.5 mt-1">
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700">
                          {student.examType}
                        </span>
                        <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-md bg-violet-100 text-violet-800 border border-violet-200">
                          Kod: {student.code || student.name.split(' ')[0].toUpperCase()}
                        </span>
                        <span className="flex items-center gap-0.5 text-[11px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded-md">
                          <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                          {student.streak} Gün
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenStudentModal(student)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-100 transition"
                      title="Öğrenciyi Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`${student.name} öğrencisini silmek istediğinize emin misiniz?`)) {
                          deleteStudent(student.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                      title="Öğrenciyi Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Target & Ranking */}
                <div className="mt-4 p-3 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500 flex items-center gap-1">
                      <Target className="w-3.5 h-3.5 text-indigo-500" />
                      Hedef:
                    </span>
                    <span className="font-bold text-slate-800 text-right">
                      {student.targetDepartment || 'Belirtilmedi'}
                    </span>
                  </div>
                  {student.targetRanking && (
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Hedef Sıralama:</span>
                      <span className="font-bold text-indigo-600">{student.targetRanking}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Günlük / Haftalık:</span>
                    <span className="font-semibold text-slate-700">
                      {student.dailyTargetQuestions} / {student.weeklyTargetQuestions} Soru
                    </span>
                  </div>
                </div>

                {/* Contacts & Notes */}
                <div className="mt-3 space-y-1 text-xs text-slate-600">
                  {student.phone && (
                    <div className="flex items-center gap-1.5">
                      <Phone className="w-3 h-3 text-slate-400" />
                      <span>{student.phone}</span>
                    </div>
                  )}
                  {student.parentName && (
                    <div className="text-[11px] text-slate-500">
                      <span className="font-medium text-slate-700">Veli:</span> {student.parentName}
                    </div>
                  )}
                  {student.notes && (
                    <p className="mt-2 text-[11px] text-slate-500 italic bg-amber-50/50 p-2 rounded-xl border border-amber-100 line-clamp-2">
                      "{student.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Bottom Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <button
                  onClick={() => setSelectedStudentId(student.id)}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 ${
                    isSelected
                      ? 'bg-indigo-50 text-indigo-700 font-extrabold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Aktif Öğrenci</span>
                    </>
                  ) : (
                    <span>Aktif Yap</span>
                  )}
                </button>

                <button
                  onClick={() => onOpenMeetingModal(student)}
                  className="p-2 rounded-xl bg-indigo-50 text-indigo-600 hover:bg-indigo-100 transition"
                  title="Koçluk Seansı / Notu Ekle"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 1-on-1 Coaching Session Log for Active Student */}
      {selectedStudent && (
        <div className="mt-8 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                {selectedStudent.name} - Birebir Koçluk Seans Geçmişi
              </h2>
              <p className="text-xs text-slate-500">
                Öğrenciyle yapılan haftalık analizler ve belirlenen aksiyon planları
              </p>
            </div>

            <button
              onClick={() => onOpenMeetingModal(selectedStudent)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition self-start sm:self-auto"
            >
              <Calendar className="w-4 h-4" />
              <span>Yeni Seans Kaydet</span>
            </button>
          </div>

          {studentMeetings.length === 0 ? (
            <div className="text-center py-10 text-slate-400 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <Clock className="w-8 h-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs font-semibold">Henüz kayıtlı koçluk seansı bulunmuyor.</p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                "Yeni Seans Kaydet" butonu ile görüşme detaylarınızı ekleyebilirsiniz.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {studentMeetings.map((meet) => (
                <div
                  key={meet.id}
                  className="p-5 rounded-2xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/60 pb-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-100/70 px-2.5 py-1 rounded-lg">
                        {meet.date}
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        {meet.durationMinutes} Dakika
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm('Bu seans notunu silmek istiyor musunuz?')) {
                          deleteMeeting(meet.id);
                        }
                      }}
                      className="p-1 text-slate-400 hover:text-rose-600 transition self-end sm:self-auto"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-slate-800">Görüşülen Konular:</span>
                      <p className="text-slate-600 mt-0.5 leading-relaxed">{meet.keyPoints}</p>
                    </div>

                    {meet.actionItems && (
                      <div className="bg-amber-50/70 p-3 rounded-xl border border-amber-200/60">
                        <span className="font-bold text-amber-900">Aksiyon Planı & Kararlar:</span>
                        <p className="text-amber-800 mt-0.5">{meet.actionItems}</p>
                      </div>
                    )}

                    {meet.nextMeetingDate && (
                      <div className="text-[11px] font-semibold text-indigo-600">
                        🗓️ Bir sonraki planlanan görüşme: {meet.nextMeetingDate}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
