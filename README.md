# Submission Tracker

A responsive dashboard where students confirm they have handed in their assignments and professors see who has and who has not. Two roles, strict separation of what each one can see, and no backend: the data starts from JSON files and lives in localStorage.

## Running it

You need Node 20.19 or newer.

```
npm install
npm run dev
```

That prints a local URL, usually `http://localhost:5173`.

```
npm run build     # production build into dist/
npm run preview   # serve the production build
npm run lint      # oxlint, which ships with the vite template
```

## Signing in

There is no real login. The first screen lists everybody in the sample data and you pick one, which stands in for authentication.

Two professors: Dr. Meera Iyer, who set three of the assignments, and Prof. Arjun Rao, who set the other two. Signing in as each in turn shows that a professor only sees their own.

Eight students. Aarav Sharma is the interesting one to start with. He has handed in three of five, so there is something to submit and something already done.

The "Reset data" button in the header puts everything back to the sample data, which is useful after trying the submission flow.

## Folder structure

```
src/
  components/
    common/     pieces both roles use: ProgressBar, StatusPill, Modal, EmptyState, Logo
    layout/     the app header
    student/    the student's assignment card, progress summary and submission modal
    admin/      the professor's assignment card, student status list and create form
  context/      the two React contexts and their providers, four files, see below
  data/         the JSON seed files, read once at startup and never written to
  hooks/        useData and useAuth, the only way components reach a context
  pages/        the three screens: LoginPage, StudentDashboard, AdminDashboard
  utils/        storage.js for localStorage, selectors.js for role based reads, format.js for dates
  App.jsx       picks which screen to show
  main.jsx      mounts the app inside both providers
  index.css     the Tailwind import and the theme
```

## Screens and components

`App.jsx` decides which screen shows. No signed in user means the login screen, a professor gets the admin dashboard, anyone else gets the student dashboard. That is the entire routing layer.

`LoginPage` lists every person in the sample data as a card and signs you in as whoever you click.

`AppHeader` shows who you are and your role, and holds "Switch user" and "Reset data".

`StudentDashboard` shows your progress summary and your own assignments, and holds which assignment the submission modal is currently about.

`AssignmentCard` draws one assignment for a student. It is handed the assignment with its own submission row already attached and reports clicks upward, so it holds no state of its own.

`SubmissionModal` runs the two step confirmation and only writes to the store on the second step.

`AdminDashboard` shows the create form and the assignments this professor created.

`AssignmentAdminCard` shows one assignment with its progress bar, and expands to reveal every student's status. Whether it is expanded is its own business, so that state lives inside the card.

`StudentStatusList` draws one row per student for a single assignment.

`CreateAssignmentForm` is four controlled fields and one errors object, with no form library.

`ProgressBar` takes a count and a total and knows nothing else, which is why the student summary and the professor's per assignment bar are the same component.

## Design decisions

### Why the data is shaped the way it is

Three flat collections, shaped the way a relational database would shape them.

`users.json` holds students and professors together, told apart by a `role` field. `assignments.json` holds assignments, each with a `createdBy` pointing at one professor. `submissions.json` is a join table with one row for every assignment and student pair, holding a status and a timestamp.

The alternative was to nest a list of students inside each assignment. The join table is better here for three reasons. Both screens fall out of it as simple filters running in opposite directions, the student screen filtering by `studentId` and the professor screen filtering by `assignmentId`, where nesting would have made one of those two awkward. It keeps one copy of each person, so changing a name is a one place edit. And it is the shape a real API would return, so replacing localStorage with `fetch` later would touch the store and nothing else.

One decision inside that is worth calling out. A submission row exists for every pair from the moment an assignment is created, starting at `not_submitted`, rather than being created when somebody submits. That is because a professor needs a denominator for the progress bar and needs to name the students who have not handed in. Working "not submitted" out from a missing row would mean rebuilding the expected list on every render. With the rows already there the arithmetic is just submitted over total. The consequence is that creating an assignment fans out one blank row per student, which is what `createAssignment` does.

### How role isolation is enforced

Every read goes through a pure function in `src/utils/selectors.js`, and no component ever touches the raw arrays. `getAssignmentsForStudent` finds a student's work through their own submission rows. `getAssignmentsForAdmin` filters by `createdBy`. Each screen is handed only the slice its role is allowed to see, so a student component cannot render somebody else's row because it never receives one.

Worth being direct about: this is a boundary in the user interface, not a security boundary. Every row is in the browser, so anyone who opens the console can read all of it. A real system would check the signed in user on the server for each request. `selectors.js` is exactly where those API calls would go, which is the point of keeping the reads in one small file instead of spreading filters through the components.

### How the double verification flow works and why it has two steps

Clicking "Mark as submitted" changes nothing. It opens a modal on step one, which asks whether the work has actually been uploaded and offers a button that opens the Drive folder in a new tab so the student can go and look. Answering "Yes, I have submitted" moves to step two, which names the assignment and says the student cannot undo it themselves. Only "Confirm submission" writes to the store. "Go back" returns to step one rather than closing.

The two steps are not the same question asked twice. The work is uploaded to Google Drive, somewhere this app cannot see, so all the app can do is record a claim it has no way to check. Step one asks the student to go and verify something about the world outside the app. Step two asks them to accept what recording that claim costs them. Collapsing both into one click would put an unverifiable claim that the student cannot reverse one accidental tap away.

The modal holds a single piece of state for which step it is on. The dashboard shows the modal by rendering it and hides it by not rendering it, so closing unmounts the component and that step state resets on its own with no cleanup code.

### How state persists

`src/data` holds the seed files. They are read once, copied into React state, and never written to, so a reset always has something clean to go back to.

From then on the data store writes itself to localStorage whenever it changes, under the key `submission-tracker:data`. The signed in user is stored separately as `submission-tracker:current-user-id`, and only the id is stored, not a copy of the person, so a login saved last week cannot start disagreeing with the store.

Every call into localStorage is wrapped in try and catch. It throws rather than returning null when a browser blocks site data, which happens in private windows, and stored text can be stale or edited by hand so parsing it can throw too. In every one of those cases the app falls back to the seed data rather than failing to start.

"Reset data" in the header throws away the saved copy and goes back to the seed. It exists so the submission flow can be tried more than once without clearing site data by hand.

### Why there is no router

The app has three screens and which one shows is decided entirely by who is signed in. A routing library would add a dependency and a set of URLs without answering a question the app is asking. `App.jsx` is the whole routing layer and it is about five lines.

### Where the Tailwind config file is

There is no `tailwind.config.js` and no `postcss.config.js`, because Tailwind v4 does not use them. The plugin is wired into `vite.config.js` and the theme lives in an `@theme` block in `src/index.css`. Anything declared there becomes a real utility class, which is how `bg-accent-600` exists.

### The progress bar width

Tailwind reads source files as plain text when it builds and never runs the code, so a class name put together while the app is running is never compiled. A width like `w-[60%]` worked out from a count would silently produce a bar with no width and no error anywhere. Inline styles would solve it in one line but the whole app is meant to be styled with Tailwind alone.

The fix is one line in `index.css`:

```css
@source inline("w-[{0..100}%]");
```

That tells Tailwind to generate all 101 percentage widths up front, so whichever one the app asks for already exists. It is the v4 replacement for what v3 called `safelist`.

### Why `src/context` has four files

A file that exports a provider component and its context object together breaks fast refresh, because the bundler can no longer tell what to hot reload and falls back to reloading the whole page. So `dataContext.js` holds only the `createContext` call and `DataProvider.jsx` holds only the component. The same reason puts the hooks in `src/hooks` rather than beside the providers.

### Responsive approach

Mobile first. The base classes describe the phone layout and `sm:` and `lg:` add to it as the screen grows, so a card grid is `grid-cols-1 lg:grid-cols-2` and never the other way round. The shared components in `components/common` carry no breakpoints at all; they adapt because their parents do. The modal sits on the bottom edge like a sheet on a phone and centres itself on wider screens.

## Known limitations

The isolation is client side only, so it is a boundary in the interface rather than a security one. Everything is in the browser.

There is one class. Every assignment goes to every student, with no courses or sections, so a professor cannot set work for a subset of the group.

A student cannot undo a submission. That is deliberate, it is what the second confirmation step warns about, but there is no way for a professor to reverse one either, which a real system would need.

The Drive links in the sample data are made up, so opening one lands on a Google Drive error page. Links entered through the create form work normally.

Everything lives in one browser. Two people on two machines do not see each other's data, and clearing site data resets the app.

There are no tests. The selectors are pure functions and were checked with throwaway scripts while building, but nothing is committed that would catch a regression.

## What I would do with more time

Put a real backend behind it and move the selectors to authenticated API calls, which is the only way the isolation becomes real.

Add courses, so an assignment targets a group rather than everybody, which is the single biggest gap between this and something a university could use.

Let a professor reopen a submission, since a student who confirms by mistake currently has no way out.

Add tests around `selectors.js` first, because it holds the isolation rules and it is pure, so it is both the most important and the easiest thing to cover.

Add sorting and filtering on the professor's view, which matters as soon as there are more than a handful of assignments.

Handle a file upload directly instead of pointing at a Drive folder, which would remove the need for the whole double verification flow, since the app could then see the work itself.
