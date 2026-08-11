import { useEffect, useState, type ComponentType, type ReactNode } from "react";
import { LoginScreen } from "../features/acesso/tela-01-login/Screen";
import { NotFoundScreen } from "../features/acesso/tela-00-nao-encontrada/Screen";
import { ForgotPasswordScreen } from "../features/acesso/tela-01a-recuperar-senha/Screen";
import { CreateAccountScreen } from "../features/acesso/tela-02-criar-conta/Screen";
import { RegisterPetScreen } from "../features/acesso/tela-03-cadastrar-pet/Screen";
import { ExperienceScreen } from "../features/acesso/tela-04-escolha-experiencia/Screen";
import { TraditionalExperienceScreen } from "../features/acesso/tela-04t-experiencia-tradicional/Screen";
import { GamifiedExperienceScreen } from "../features/acesso/tela-04g-experiencia-gamificada/Screen";
import { HomeFrame, type HomeVariant } from "../features/inicio/HomeFrame";
import { HomeTutorScreen } from "../features/inicio/tela-05-home-tutor/Screen";
import { TraditionalHomeScreen } from "../features/inicio/tela-05t-home-tradicional/Screen";
import { TutorProfileScreen } from "../features/inicio/tela-06-perfil-tutor/Screen";
import {
  AccountSettingsScreen,
  type ExperienceMode,
} from "../features/inicio/tela-06c-configuracoes-conta/Screen";
import { ExperienceSettingsScreen } from "../features/inicio/tela-06d-escolher-experiencia/Screen";
import { ChangeEmailScreen } from "../features/inicio/tela-06e-alterar-email/Screen";
import { ChangePasswordScreen } from "../features/inicio/tela-06f-alterar-senha/Screen";
import { NotificationsScreen } from "../features/inicio/tela-06a-notificacoes/Screen";
import { ClinicLinkScreen } from "../features/pets/tela-06b-vinculo-clinica/Screen";
import { MyPetsScreen } from "../features/pets/tela-07-meus-pets/Screen";
import { AddPetScreen } from "../features/pets/tela-07a-adicionar-pet/Screen";
import { ConsultationsScreen } from "../features/pets/tela-07b-consultas/Screen";
import { PetProfileScreen } from "../features/pets/tela-08-perfil-pet/Screen";
import { RoutineScreen } from "../features/pets/tela-09-ver-rotina/Screen";
import { WeeklyRoutineScreen } from "../features/pets/tela-09a-rotina-semanal/Screen";
import { BathRoutineScreen } from "../features/pets/tela-09b-rotina-banho/Screen";
import { RoutineHistoryScreen } from "../features/pets/tela-09c-rotina-historico/Screen";
import {
  RoutineHistoryDetailsScreen,
  type RoutineHistoryKey,
} from "../features/pets/tela-09d-detalhes-historico/Screen";
import { AddRoutineScreen } from "../features/pets/tela-09e-adicionar-rotina/Screen";
import { MedicinesScreen } from "../features/pets/tela-10-ver-remedios/Screen";
import { UpcomingMedicinesScreen } from "../features/pets/tela-10a-remedios-proximos/Screen";
import { TodayMedicinesScreen } from "../features/pets/tela-10b-remedios-hoje/Screen";
import { MedicinesHistoryScreen } from "../features/pets/tela-10c-historico-remedios/Screen";
import { OmegaHistoryDetailScreen } from "../features/pets/tela-10d-detalhes-omega/Screen";
import { PrednisoloneHistoryDetailScreen } from "../features/pets/tela-10e-detalhes-prednisolona/Screen";
import { DewormerHistoryDetailScreen } from "../features/pets/tela-10f-detalhes-vermifugo/Screen";
import { NexGardDetailScreen } from "../features/pets/tela-10g-detalhes-nexgard/Screen";
import { AddMedicineScreen } from "../features/pets/tela-10h-adicionar-remedio/Screen";
import { WalletScreen } from "../features/pets/tela-11-ver-carteira/Screen";
import { SharedCareScreen } from "../features/pets/tela-12-cuidado-compartilhado/Screen";
import { AddTutorScreen } from "../features/pets/tela-13-adicionar-tutor/Screen";
import { ChatbotBaluScreen } from "../features/comunicacao/tela-14-chatbot-balu/Screen";
import { CommunitiesScreen } from "../features/comunidade/tela-15-comunidades-tematicas/Screen";
import { AllCommunitiesScreen } from "../features/comunidade/tela-15a-todas-comunidades/Screen";
import { CaramelClubScreen } from "../features/comunidade/tela-16-clube-caramelos/Screen";
import { communityByScreen } from "../features/comunidade/community-data";
import { MainNavigationProvider, type MainDestination } from "../components/ui/MobileShell";
import {
  ErrorFeedbackProvider,
  useErrorFeedback,
} from "../components/ui/error-feedback/ErrorFeedback";
import { PetProfileProvider } from "../components/ui/pet-profile/PetProfileContext";
import { pathForScreen, pathForView, screenForPath, viewForPath, type AppView } from "./routes";

type View = AppView;

export default function App() {
  return (
    <ErrorFeedbackProvider>
      <PetProfileProvider>
        <AppContent />
      </PetProfileProvider>
    </ErrorFeedbackProvider>
  );
}

function AppContent() {
  const { showModal } = useErrorFeedback();
  const routeScreen = screenForPath(window.location.pathname);
  const [screen, setScreen] = useState<string | undefined>(routeScreen);
  const [view, setView] = useState<View>(() => viewForPath(window.location.pathname));
  const [addPetReturn, setAddPetReturn] = useState<View>("pets");
  const [editingPet, setEditingPet] = useState(false);
  const [medicineDetailReturn, setMedicineDetailReturn] = useState("10c");
  const [routineHistoryRecord, setRoutineHistoryRecord] = useState<RoutineHistoryKey>("yesterday");
  const [notificationReturn, setNotificationReturn] = useState(false);
  const [experience, setExperience] = useState<ExperienceMode>(() => {
    const savedExperience = localStorage.getItem("balu-experience");
    return savedExperience === "traditional" ? "traditional" : "gamified";
  });
  const [fontLevel, setFontLevel] = useState(() => {
    const saved = Number(localStorage.getItem("balu-font-level"));
    return saved >= 1 && saved <= 5 ? saved : 3;
  });

  useEffect(() => {
    localStorage.setItem("balu-font-level", String(fontLevel));
    document.documentElement.dataset.baluFontLevel = String(fontLevel);
  }, [fontLevel]);

  const openView = (next: View) => {
    setNotificationReturn(false);
    window.history.replaceState({}, "", pathForView(next));
    setScreen(undefined);
    setView(next);
  };
  const openScreen = (next: string) => {
    const path = pathForScreen(next);
    if (!path) return;
    window.history.replaceState({}, "", path);
    setScreen(next);
  };
  const openFromNotifications = (next: string) => {
    setNotificationReturn(true);
    openScreen(next);
  };
  const backFromNotificationOr = (fallback: string) => {
    if (notificationReturn) {
      setNotificationReturn(false);
      openScreen("6a");
      return;
    }
    openScreen(fallback);
  };
  const openAddPet = (returnTo: View) => {
    setEditingPet(false);
    setAddPetReturn(returnTo);
    openScreen("7a");
  };
  const saveExperience = (nextExperience: ExperienceMode) => {
    localStorage.setItem("balu-experience", nextExperience);
    setExperience(nextExperience);
  };
  const openMedicineDetail = (detailScreen: string, returnScreen: string) => {
    setMedicineDetailReturn(returnScreen);
    openScreen(detailScreen);
  };
  const navigate = (destination: MainDestination) => openView(destination);
  const withMainNavigation = (content: ReactNode) => (
    <MainNavigationProvider onNavigate={navigate}>{content}</MainNavigationProvider>
  );

  if (screen === "2")
    return (
      <CreateAccountScreen
        onBack={() => openView("login")}
        onEnter={() => openScreen("3")}
        onLogin={() => openView("login")}
      />
    );
  if (screen === "3")
    return <RegisterPetScreen onBack={() => openScreen("2")} onComplete={() => openScreen("4")} />;
  if (screen === "4")
    return (
      <ExperienceScreen
        onBack={() => openScreen("3")}
        onComplete={(choice) => {
          if (choice === "traditional") {
            openScreen("4t");
          } else {
            saveExperience("gamified");
            openView("home");
          }
        }}
      />
    );
  if (screen === "4t")
    return (
      <TraditionalExperienceScreen
        onComplete={() => {
          saveExperience("traditional");
          openScreen("5t");
        }}
      />
    );
  if (screen === "4g") return <GamifiedExperienceScreen />;
  if (screen === "6")
    return withMainNavigation(
      <TutorProfileScreen
        onBack={() => openView("home")}
        onOpenSettings={() => openScreen("6c")}
      />,
    );
  if (screen === "6c")
    return withMainNavigation(
      <AccountSettingsScreen
        experience={experience}
        onBack={() => openScreen("6")}
        onChooseExperience={() => openScreen("6d")}
        onChangeEmail={() => openScreen("6e")}
        onChangePassword={() => openScreen("6f")}
        fontLevel={fontLevel}
        onFontLevelChange={setFontLevel}
      />,
    );
  if (screen === "6d")
    return withMainNavigation(
      <ExperienceSettingsScreen
        currentExperience={experience}
        onBack={() => openScreen("6c")}
        onSave={(nextExperience) => {
          saveExperience(nextExperience);
          openView("home");
        }}
      />,
    );
  if (screen === "6e")
    return withMainNavigation(<ChangeEmailScreen onBack={() => openScreen("6c")} />);
  if (screen === "6f")
    return withMainNavigation(<ChangePasswordScreen onBack={() => openScreen("6c")} />);
  if (screen === "6a")
    return withMainNavigation(
      <NotificationsScreen
        onBack={() => openView("home")}
        onOpenNotification={openFromNotifications}
      />,
    );
  if (screen === "6b")
    return withMainNavigation(<ClinicLinkScreen onBack={() => openScreen("6a")} />);
  if (screen === "7a")
    return (
      <AddPetScreen
        onBack={() => openView(addPetReturn)}
        onComplete={() => openView(addPetReturn)}
        editing={editingPet}
      />
    );
  if (screen === "7")
    return (
      <MyPetsScreen
        onNavigate={navigate}
        onOpen={openScreen}
        onAddPet={() => openAddPet("pets")}
        onEditPet={() => {
          setEditingPet(true);
          setAddPetReturn("pets");
          openScreen("7a");
        }}
      />
    );
  if (screen === "7b")
    return withMainNavigation(<ConsultationsScreen onBack={() => openView("pets")} />);
  if (screen === "8")
    return withMainNavigation(
      <PetProfileScreen onBack={() => openView("pets")} onOpen={openScreen} />,
    );
  if (screen === "9")
    return withMainNavigation(
      <RoutineScreen onBack={() => backFromNotificationOr("8")} onOpen={openScreen} />,
    );
  if (screen === "9a")
    return withMainNavigation(
      <WeeklyRoutineScreen onBack={() => openScreen("8")} onOpen={openScreen} />,
    );
  if (screen === "9b")
    return withMainNavigation(
      <BathRoutineScreen onBack={() => openScreen("8")} onOpen={openScreen} />,
    );
  if (screen === "9c")
    return withMainNavigation(
      <RoutineHistoryScreen
        onBack={() => openScreen("8")}
        onOpen={openScreen}
        onOpenHistoryDetail={(record) => {
          setRoutineHistoryRecord(record);
          openScreen("9d");
        }}
      />,
    );
  if (screen === "9d")
    return withMainNavigation(
      <RoutineHistoryDetailsScreen
        recordKey={routineHistoryRecord}
        onBack={() => openScreen("9c")}
      />,
    );
  if (screen === "9e") return <AddRoutineScreen onBack={() => openScreen("9")} />;
  if (screen === "10")
    return withMainNavigation(
      <MedicinesScreen
        onBack={() => backFromNotificationOr("8")}
        onOpen={openScreen}
        onOpenDetail={(detail) => openMedicineDetail(detail, "10")}
      />,
    );
  if (screen === "10a")
    return withMainNavigation(
      <UpcomingMedicinesScreen
        onBack={() => openScreen("8")}
        onOpen={openScreen}
        onOpenDetail={(detail) => openMedicineDetail(detail, "10a")}
      />,
    );
  if (screen === "10b")
    return withMainNavigation(
      <TodayMedicinesScreen
        onBack={() => openScreen("8")}
        onOpen={openScreen}
        onOpenDetail={(detail) => openMedicineDetail(detail, "10b")}
      />,
    );
  if (screen === "10c")
    return withMainNavigation(
      <MedicinesHistoryScreen
        onBack={() => openScreen("8")}
        onOpen={openScreen}
        onOpenDetail={(detail) => openMedicineDetail(detail, "10c")}
      />,
    );
  if (screen === "10d")
    return withMainNavigation(
      <OmegaHistoryDetailScreen onBack={() => openScreen(medicineDetailReturn)} />,
    );
  if (screen === "10e")
    return withMainNavigation(
      <PrednisoloneHistoryDetailScreen onBack={() => openScreen(medicineDetailReturn)} />,
    );
  if (screen === "10f")
    return withMainNavigation(
      <DewormerHistoryDetailScreen onBack={() => openScreen(medicineDetailReturn)} />,
    );
  if (screen === "10g")
    return withMainNavigation(
      <NexGardDetailScreen onBack={() => openScreen(medicineDetailReturn)} />,
    );
  if (screen === "10h") return <AddMedicineScreen onBack={() => openScreen("10")} />;
  if (screen === "11")
    return withMainNavigation(<WalletScreen onBack={() => openScreen("8")} onOpen={openScreen} />);
  if (screen === "12")
    return withMainNavigation(
      <SharedCareScreen
        onBack={() => backFromNotificationOr("8")}
        onInvite={() => openScreen("13")}
      />,
    );
  if (screen === "13")
    return withMainNavigation(<AddTutorScreen onBack={() => openScreen("12")} />);
  if (screen === "14")
    return withMainNavigation(
      <ChatbotBaluScreen onBack={() => openView("home")} onNavigate={navigate} />,
    );
  if (screen === "15")
    return withMainNavigation(
      <CommunitiesScreen
        onNavigate={navigate}
        onOpenClub={openScreen}
        onOpenAll={() => openScreen("15a")}
      />,
    );
  if (screen === "15a")
    return withMainNavigation(
      <AllCommunitiesScreen
        onBack={() => openView("community")}
        onOpenClub={openScreen}
        onNavigate={navigate}
      />,
    );
  if (screen && communityByScreen[screen])
    return withMainNavigation(
      <CaramelClubScreen
        community={communityByScreen[screen]}
        onBack={() => (notificationReturn ? backFromNotificationOr("15") : openView("community"))}
        onNavigate={navigate}
      />,
    );
  if (screen && homeVariantByScreen[screen])
    return (
      <HomeFrame
        variant={homeVariantByScreen[screen]}
        onNavigate={navigate}
        onOpenNotifications={() => openScreen("6a")}
        onOpenProfile={() => openScreen("6")}
        onAddPet={() => openAddPet("home")}
      />
    );
  if (screen && numberedScreenComponents[screen]) {
    const NumberedScreen = numberedScreenComponents[screen];
    return (
      <MainNavigationProvider onNavigate={navigate}>
        <NumberedScreen />
      </MainNavigationProvider>
    );
  }

  if (view === "forgot") return <ForgotPasswordScreen onBack={() => openView("login")} />;
  if (view === "not-found") return <NotFoundScreen onHome={() => openView("login")} />;
  if (view === "login")
    return (
      <LoginScreen
        onEnter={() => openView("home")}
        onCreateAccount={() => openView("account")}
        onForgotPassword={() => openView("forgot")}
        onGoogleUnavailable={() =>
          showModal({
            title: "Login indisponível",
            message: "O login com Google ainda não está disponível.",
            singleLineMessage: true,
          })
        }
        onAppleUnavailable={() =>
          showModal({
            title: "Login indisponível",
            message: "O login com Apple ainda não está disponível.",
          })
        }
      />
    );
  if (view === "account")
    return (
      <CreateAccountScreen
        onBack={() => openView("login")}
        onEnter={() => openScreen("3")}
        onLogin={() => openView("login")}
      />
    );
  if (view === "home")
    return experience === "traditional" ? (
      <TraditionalHomeScreen
        onNavigate={navigate}
        onOpenNotifications={() => openScreen("6a")}
        onOpenProfile={() => openScreen("6")}
        onAddPet={() => openAddPet("home")}
      />
    ) : (
      <HomeTutorScreen
        onNavigate={navigate}
        onOpenNotifications={() => openScreen("6a")}
        onOpenProfile={() => openScreen("6")}
        onAddPet={() => openAddPet("home")}
      />
    );
  if (view === "pets")
    return (
      <MyPetsScreen
        onNavigate={navigate}
        onOpen={openScreen}
        onAddPet={() => openAddPet("pets")}
        onEditPet={() => {
          setEditingPet(true);
          setAddPetReturn("pets");
          openScreen("7a");
        }}
      />
    );
  if (view === "community")
    return (
      <CommunitiesScreen
        onNavigate={navigate}
        onOpenClub={openScreen}
        onOpenAll={() => openScreen("15a")}
      />
    );
  return <ChatbotBaluScreen onBack={() => openView("home")} onNavigate={navigate} />;
}

const numberedScreenComponents: Record<string, ComponentType> = {
  "7": MyPetsScreen,
  "15": CommunitiesScreen,
};

const homeVariantByScreen: Record<string, HomeVariant> = {
  "5": "5",
  "5a": "5a",
  "5b": "5b",
  "5t": "5t",
  "5ta": "5ta",
  "5tb": "5tb",
};
