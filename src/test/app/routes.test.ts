import { describe, expect, test } from "vitest";
import { pathForScreen, screenForPath } from "../../app/routes";

describe("rotas funcionais do aplicativo mobile", () => {
  test.each([
    ["2", "/onboarding/criar-conta"],
    ["3", "/onboarding/cadastrar-pet"],
    ["4", "/onboarding/escolher-experiencia"],
    ["6", "/perfil"],
    ["6e", "/perfil/configuracoes/alterar-email"],
    ["6f", "/perfil/configuracoes/alterar-senha"],
    ["7", "/pets"],
    ["9c", "/pets/rotina/historico"],
    ["10c", "/pets/medicamentos/historico"],
    ["12", "/pets/cuidado-compartilhado"],
    ["14", "/chat"],
    ["16", "/comunidade/clube-dos-caramelos"],
    ["16a", "/comunidade/clube-dos-vira-latas"],
    ["16b", "/comunidade/clube-dos-gateiros"],
    ["16c", "/comunidade/golden-retriever"],
    ["16d", "/comunidade/shih-tzu"],
    ["16e", "/comunidade/poodle"],
    ["16f", "/comunidade/labrador"],
    ["16g", "/comunidade/pinscher"],
    ["16h", "/comunidade/bulldog"],
  ])("mapeia a tela %s para %s", (screen, path) => {
    expect(pathForScreen(screen)).toBe(path);
    expect(screenForPath(path)).toBe(screen);
  });

  test("não aceita novamente identificadores numéricos como URL", () => {
    expect(screenForPath("/?tela=10c")).toBeUndefined();
  });
});
