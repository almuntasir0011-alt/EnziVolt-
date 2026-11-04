# EnziVolt — বিনা খরচের Local Supabase Development

**উদ্দেশ্য:** Supabase Cloud Development Branch বা অতিরিক্ত Cloud Project ছাড়াই নিজের কম্পিউটারে EnziVolt-এর Database, Auth, Storage ও Migration পরীক্ষা করা।

## খরচ ও সীমা

- Supabase Local Development Stack চালানোর জন্য Supabase-এর hourly branch charge লাগে না।
- Docker/Container runtime ও Supabase CLI স্থানীয় কম্পিউটারে চলবে।
- Docker image download, disk space, RAM এবং বিদ্যুৎ/ইন্টারনেট ব্যবহার হবে। এগুলোর জন্য Supabase Cloud branch bill তৈরি হয় না; তবে আপনার ডিভাইস/ইন্টারনেটের নিজস্ব খরচ থাকতে পারে।
- এই পদ্ধতি Production database-এ কোনো পরিবর্তন করে না, যতক্ষণ না স্পষ্টভাবে remote command চালানো হয়।

## প্রয়োজন

- Windows / macOS / Linux কম্পিউটার
- Node.js 20 বা পরবর্তী সংস্করণ
- Docker Desktop অথবা Docker-compatible runtime
- Git repository clone করা
- প্রথমবার Docker image নামানোর জন্য ইন্টারনেট

> Android ফোনে Docker Desktop-এর স্বাভাবিক desktop workflow চালানো যায় না। ফোন থেকে কোড দেখা/সম্পাদনা করা সম্ভব, কিন্তু Local Supabase Stack চালাতে Docker-compatible computer প্রয়োজন।

## প্রথমবার সেটআপ

Repository root-এ Terminal খুলে:

```bash
node --version
docker --version
npx supabase --version
```

Supabase CLI ব্যবহার:

```bash
npx supabase init
```

যদি CLI জানায় Supabase config আগে থেকেই আছে, সেটি overwrite করবেন না। এরপর:

```bash
npx supabase start
```

Local Studio সাধারণত: http://localhost:54323  
Local API সাধারণত: http://localhost:54321  
Local PostgreSQL সাধারণত: localhost:54322

CLI start হলে যে local URL ও key দেখাবে, সেগুলো কেবল local development-এ ব্যবহার করুন।

## নিরাপদ কাজের নিয়ম

1. Git branch: `feature/local-supabase-development-v1`
2. Production project ref: `yvbwtdurxesdcorkydby` — শুধু পরিচিতি/রেফারেন্সের জন্য।
3. এই local workflow-তে `supabase link`, `--linked`, `--remote`, `db push --remote`, `db reset --remote` চালাবেন না।
4. Local database-এ migration পরীক্ষা করুন:
   ```bash
   npx supabase db reset
   ```
   **সতর্কতা:** এটি Local database মুছে আবার migrations চালায়; Production database নয়, যদি command-এ remote target যোগ না করা হয়।
5. Migration সফল না হলে Production-এ প্রয়োগ নয়।
6. Production-এ deploy/merge করার আগে আলাদা অনুমোদন, backup, security review ও test evidence লাগবে।
7. Local stack কখনো public internet-এ expose করবেন না; default credentials কেবল local test-এর জন্য।

## দৈনন্দিন ব্যবহার

চালু:
```bash
npx supabase start
```

বন্ধ:
```bash
npx supabase stop
```

Local migrations নতুন করে যাচাই:
```bash
npx supabase db reset
```

## EnziVolt release policy

- Production/পুরোনো live version অপরিবর্তিত থাকবে।
- নতুন কাজ নতুন version/feature branch-এ হবে।
- Customer Portal v1.1, Technician Portal v1.2, Admin v1.3, Assignment v1.4, Communication v1.5 পরিকল্পনা অনুযায়ী আলাদা যাচাই হবে।
- Local migration test ও browser end-to-end test পাস না করা পর্যন্ত PR Draft থাকবে।
- এই ডকুমেন্ট তৈরি হওয়া মানেই Local Stack আপনার ডিভাইসে চালু হয়েছে—এমন নয়। প্রথমবার Docker/CLI ইনস্টল ও `supabase start` চালানোর পরই runtime verification হবে।

## অফিসিয়াল নির্দেশনা

- Supabase Local Development: https://supabase.com/docs/guides/local-development
- CLI setup: https://supabase.com/docs/guides/local-development/cli/getting-started
- Local workflow: https://supabase.com/docs/guides/local-development/cli-workflows
