# Backend Notes

## Cache da busca léxica

A busca léxica não deve mais abrir os arquivos `.xlsx` grandes no hot path sempre que possível.
O backend agora prefere arquivos pré-processados em `backend/files/Lexical_preprocessed/*.ndjson`.

Os arquivos `.xlsx` em `backend/files/Lexical/` continuam sendo a fonte de edição.
Os arquivos `.ndjson` são o cache de runtime para reduzir consumo de memória em `/lexical_search`.

## Quando regenerar o cache

Regere o cache sempre que:

- algum arquivo `backend/files/Lexical/*.xlsx` for alterado;
- um novo livro `.xlsx` for adicionado;
- você quiser garantir que o deploy suba com o cache atualizado.

## Como regenerar o cache

Na raiz do repositório:

```powershell
python backend\scripts\build_lexical_cache.py
```

Para gerar apenas um livro:

```powershell
python backend\scripts\build_lexical_cache.py --book LO
```

## Fluxo recomendado antes de commit/deploy

1. Atualize os `.xlsx` em `backend/files/Lexical/`, se houver mudanças.
2. Gere o cache com `python backend\scripts\build_lexical_cache.py`.
3. Confira se `backend/files/Lexical_preprocessed/` foi atualizado.
4. Inclua no commit tanto os `.xlsx` alterados quanto os `.ndjson` correspondentes.
5. Faça o deploy.

## Observações

- Se o cache `.ndjson` estiver ausente ou desatualizado, o backend ainda faz fallback para o `.xlsx`.
- Esse fallback existe por segurança, mas o ideal em produção é subir com `Lexical_preprocessed` já pronto.
- Os testes do backend usam `pytest`.
