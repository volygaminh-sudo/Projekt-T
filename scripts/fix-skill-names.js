/**
 * fix-skill-names.js
 * Quét 127 tướng trong DB, tách tên kỹ năng nếu format "TênKN: MôTả"
 * Usage: node scripts/fix-skill-names.js [--dry-run] [--hero-id=XX]
 */

const BASE_URL = 'http://localhost:3000/api/heroes';
const isDryRun = process.argv.includes('--dry-run');
const heroIdFilter = process.argv.find(a => a.startsWith('--hero-id='))?.split('=')[1];

const SKILL_KEYS = ['skill_p', 'skill_1', 'skill_2', 'skill_3'];
const SKILL_NAME_FIELDS = ['skill_p_name', 'skill_1_name', 'skill_2_name', 'skill_3_name'];

/**
 * Parse a skill field into { name, description }.
 * Rule: if there's a colon within the first 60 chars, treat text before it as skill name.
 */
function parseSkillField(raw) {
    if (!raw || !raw.trim()) return { name: '', description: '' };

    const colonIdx = raw.indexOf(':');
    // Only treat as "Name: Desc" if colon is within first 60 chars AND the left side looks like a name (no newlines)
    if (colonIdx > 0 && colonIdx < 60) {
        const candidateName = raw.substring(0, colonIdx).trim();
        const description = raw.substring(colonIdx + 1).trim();
        // Reject if candidate name has newlines or is too short/long
        if (!candidateName.includes('\n') && candidateName.length >= 3 && candidateName.length <= 50) {
            return { name: candidateName, description };
        }
    }
    return { name: '', description: raw.trim() };
}

async function main() {
    console.log(`\n🔧 Script sửa tên kỹ năng${isDryRun ? ' [DRY RUN — không ghi DB]' : ''}\n`);

    // 1. Load all heroes
    const res = await fetch(BASE_URL);
    if (!res.ok) throw new Error(`❌ Không kết nối được server: ${res.status}`);
    const { data: heroes } = await res.json();

    const filtered = heroIdFilter 
        ? heroes.filter(h => String(h.id) === heroIdFilter) 
        : heroes;

    console.log(`📋 Tổng số tướng cần kiểm tra: ${filtered.length}\n`);

    let totalFixed = 0;
    let totalSkipped = 0;
    let totalErrors = 0;

    for (const hero of filtered) {
        const updates = {};
        let hasChanges = false;

        for (let i = 0; i < SKILL_KEYS.length; i++) {
            const key = SKILL_KEYS[i];
            const raw = hero[key];
            if (!raw) continue;

            const { name, description } = parseSkillField(raw);

            // If a name was extracted and the field currently embeds it
            if (name && description) {
                const currentName = (hero[`${key.replace('skill_', 'skill_')}_name`] || '').trim();
                // Only update if the field doesn't already have a proper name stored separately
                // Check: does the skill text still contain "Name: ..." pattern?
                if (raw.startsWith(`${name}:`)) {
                    updates[key] = `${name}: ${description}`; // keep existing format, server parses it
                    console.log(`  ✅ ${hero.name} [${key}]: "${name}"`);
                    hasChanges = true;
                }
            } else {
                // no change needed
            }
        }

        if (!hasChanges) {
            totalSkipped++;
            continue;
        }

        if (isDryRun) {
            console.log(`  → [DRY RUN] Sẽ cập nhật: ${hero.name} (ID: ${hero.id})`);
            totalFixed++;
            continue;
        }

        // PUT update
        try {
            const putRes = await fetch(`${BASE_URL}/${hero.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...hero, ...updates }),
            });
            if (putRes.ok) {
                totalFixed++;
            } else {
                const err = await putRes.json();
                console.error(`  ❌ Lỗi cập nhật ${hero.name}: ${err.error}`);
                totalErrors++;
            }
        } catch (e) {
            console.error(`  ❌ Network error với ${hero.name}: ${e.message}`);
            totalErrors++;
        }
    }

    console.log(`\n${isDryRun ? '[DRY RUN] ' : ''}📊 Kết quả:`);
    console.log(`  ✅ Đã sửa:     ${totalFixed} tướng`);
    console.log(`  ⏭️  Bỏ qua:     ${totalSkipped} tướng (không cần sửa)`);
    console.log(`  ❌ Lỗi:        ${totalErrors} tướng\n`);
}

main().catch(err => {
    console.error('Fatal error:', err.message);
    process.exit(1);
});
