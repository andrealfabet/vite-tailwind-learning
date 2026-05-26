import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import { personalInfo, skillGroups, experiences, education } from "../data/cv";

// ─── Styles ────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 10,
    color: "#111827",
    paddingTop: 40,
    paddingBottom: 40,
    paddingLeft: 50,
    paddingRight: 50,
    lineHeight: 1.4,
  },

  // Header
  header: {
    marginBottom: 14,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#d1d5db",
    borderBottomStyle: "solid",
  },
  name: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 11,
    color: "#374151",
    marginBottom: 6,
  },
  contactRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  contactItem: {
    fontSize: 9,
    color: "#4b5563",
    marginRight: 14,
  },

  // Section
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#0f172a",
    textTransform: "uppercase",
    letterSpacing: 1.2,
    paddingBottom: 3,
    marginBottom: 7,
    borderBottomWidth: 0.75,
    borderBottomColor: "#e5e7eb",
    borderBottomStyle: "solid",
  },

  // Summary
  summary: {
    fontSize: 9.5,
    color: "#374151",
    lineHeight: 1.5,
  },

  // Skills
  skillRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  skillLabel: {
    width: 100,
    fontFamily: "Helvetica-Bold",
    fontSize: 9,
    color: "#1f2937",
  },
  skillItems: {
    flex: 1,
    fontSize: 9,
    color: "#4b5563",
  },

  // Experience
  expEntry: {
    marginBottom: 10,
  },
  expHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 1,
  },
  expRole: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#0f172a",
    flex: 1,
  },
  expPeriod: {
    fontSize: 9,
    color: "#6b7280",
    marginLeft: 8,
  },
  expCompany: {
    fontSize: 9,
    color: "#374151",
    fontStyle: "italic",
    marginBottom: 4,
  },
  bullet: {
    flexDirection: "row",
    marginBottom: 2,
    paddingLeft: 4,
  },
  bulletDot: {
    width: 10,
    fontSize: 9,
    color: "#374151",
  },
  bulletText: {
    flex: 1,
    fontSize: 9,
    color: "#374151",
    lineHeight: 1.4,
  },
  techRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  techTag: {
    fontSize: 8,
    color: "#374151",
    backgroundColor: "#f3f4f6",
    paddingLeft: 5,
    paddingRight: 5,
    paddingTop: 1.5,
    paddingBottom: 1.5,
    borderRadius: 3,
    marginRight: 4,
    marginBottom: 2,
  },

  // Education
  eduHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  eduDegree: {
    fontFamily: "Helvetica-Bold",
    fontSize: 10,
    color: "#0f172a",
    flex: 1,
    marginRight: 8,
  },
  eduPeriod: {
    fontSize: 9,
    color: "#6b7280",
  },
  eduInstitution: {
    fontSize: 9,
    color: "#374151",
    fontStyle: "italic",
    marginTop: 2,
  },
});

// ─── PDF Document ──────────────────────────────────────────────────────────
export function CvDocument() {
  return (
    <Document
      title={`CV – ${personalInfo.name}`}
      author={personalInfo.name}
      subject="Software Developer CV"
      keywords="software developer, .NET, CMS, Next.js, C#"
    >
      <Page size="A4" style={s.page}>
        {/* ── Header ── */}
        <View style={s.header}>
          <Text style={s.name}>{personalInfo.name}</Text>
          <Text style={s.jobTitle}>{personalInfo.title}</Text>
          <View style={s.contactRow}>
            <Text style={s.contactItem}>{personalInfo.location}</Text>
            <Text style={s.contactItem}>{personalInfo.email}</Text>
            <Text style={s.contactItem}>{personalInfo.phone}</Text>
            <Text style={s.contactItem}>{personalInfo.linkedin}</Text>
          </View>
        </View>

        {/* ── Professional Summary ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Professional Summary</Text>
          <Text style={s.summary}>{personalInfo.summary}</Text>
        </View>

        {/* ── Skills ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Skills</Text>
          {skillGroups.map((group) => (
            <View key={group.category} style={s.skillRow}>
              <Text style={s.skillLabel}>{group.category}:</Text>
              <Text style={s.skillItems}>{group.items.join("  ·  ")}</Text>
            </View>
          ))}
        </View>

        {/* ── Work Experience ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Work Experience</Text>
          {experiences.map((exp, i) => (
            <View key={i} style={s.expEntry}>
              <View style={s.expHeaderRow}>
                <Text style={s.expRole}>{exp.role}</Text>
                <Text style={s.expPeriod}>{exp.period}</Text>
              </View>
              <Text style={s.expCompany}>{exp.company}</Text>
              {exp.bullets.map((bullet, j) => (
                <View key={j} style={s.bullet}>
                  <Text style={s.bulletDot}>•</Text>
                  <Text style={s.bulletText}>{bullet}</Text>
                </View>
              ))}
              <View style={s.techRow}>
                {exp.tech.map((t) => (
                  <Text key={t} style={s.techTag}>{t}</Text>
                ))}
              </View>
            </View>
          ))}
        </View>

        {/* ── Education ── */}
        <View style={s.section}>
          <Text style={s.sectionTitle}>Education</Text>
          <View style={s.eduHeaderRow}>
            <Text style={s.eduDegree}>{education.degree}</Text>
            <Text style={s.eduPeriod}>{education.period}</Text>
          </View>
          <Text style={s.eduInstitution}>{education.institution}</Text>
        </View>
      </Page>
    </Document>
  );
}
