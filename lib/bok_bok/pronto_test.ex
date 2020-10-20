defmodule Abc do
  def failing_function(first) do
    try do
      to_string(first)
    rescue
      _ -> :rescued
    end
  end

  def bad do
    raise ArithmeticError
  end
end
